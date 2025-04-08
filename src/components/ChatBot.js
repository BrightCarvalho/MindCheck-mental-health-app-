import React, { useState, useEffect, useRef } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { identifyIntent, getResponse } from '../data/chatbotKnowledgeBase';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Generate or retrieve user ID on component mount
  useEffect(() => {
    // Check if user ID exists in local storage
    const storedUserId = localStorage.getItem('chatbot_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
      // Load previous conversations
      loadConversationHistory(storedUserId);
    } else {
      // Generate new user ID
      const newUserId = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chatbot_user_id', newUserId);
      setUserId(newUserId);
      
      // Add welcome message
      setMessages([
        {
          id: 'welcome',
          text: "Hello! I'm your mental health assistant. How can I help you today?",
          sender: 'assistant',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversation history
  const loadConversationHistory = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/conversations/${userId}`);
      if (response.data && response.data.messages) {
        setMessages(response.data.messages);
      } else {
        // Add welcome message if no history
        setMessages([
          {
            id: 'welcome',
            text: "Hello! I'm your mental health assistant. How can I help you today?",
            sender: 'assistant',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      // Add welcome message if error
      setMessages([
        {
          id: 'welcome',
          text: "Hello! I'm your mental health assistant. How can I help you today?",
          sender: 'assistant',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  // Save message to storage
  const saveMessage = async (messageData) => {
    try {
      // Save to local storage as fallback
      const currentMessages = JSON.parse(localStorage.getItem(`chat_history_${userId}`) || '[]');
      const updatedMessages = [...currentMessages, messageData];
      localStorage.setItem(`chat_history_${userId}`, JSON.stringify(updatedMessages));
      
      // Try to save to API if available
      try {
        await axios.post('/api/conversations/message', {
          userId,
          message: messageData
        });
      } catch (apiError) {
        console.log('API not available, using local storage only');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Get response using knowledge base or API
  const getBotResponse = async (userMessage) => {
    try {
      setIsLoading(true);
      
      // First try to get response from API
      try {
        const response = await axios.post('/api/ai/chat', {
          userId,
          message: userMessage
        });
        return response.data.reply;
      } catch (apiError) {
        console.log('API not available, using local knowledge base');
        // Fallback to local knowledge base
        const intent = identifyIntent(userMessage);
        return getResponse(intent, userMessage);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      return "I'm having trouble processing your request. Could you try again?";
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    // Create user message object
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Update UI immediately with user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    
    // Save user message
    await saveMessage(userMessage);
    
    // Get bot response
    const botReply = await getBotResponse(inputMessage);
    
    // Create bot message object
    const botMessage = {
      id: Date.now() + 1,
      text: botReply,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    
    // Update UI with bot response
    setMessages(prevMessages => [...prevMessages, botMessage]);
    
    // Save bot message
    await saveMessage(botMessage);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container d-flex flex-column h-100">
      <div className="messages-container flex-grow-1 p-3 overflow-auto">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'} mb-2`}
          >
            <div className={`message-bubble p-2 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
              {message.text}
            </div>
            <small className="text-muted d-block mt-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container p-2 border-top">
        <InputGroup>
          <FormControl
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <Button 
            variant="primary" 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatBot;