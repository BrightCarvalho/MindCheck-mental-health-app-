import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaCommentDots, FaTimes } from 'react-icons/fa';
import ChatBot from './ChatBot';

const ChatButton = () => {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <>
      {showChatBot && (
        <div className="chat-window">
          <div className="chat-header">
            <h5 className="mb-0">Chat Support</h5>
            <Button 
              variant="link" 
              className="close-button p-0 text-white"
              onClick={() => setShowChatBot(false)}
            >
              <FaTimes />
            </Button>
          </div>
          <div className="chat-body">
            <ChatBot />
          </div>
        </div>
      )}
      <Button 
        className="chat-button"
        variant="primary"
        onClick={() => setShowChatBot(!showChatBot)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        <FaCommentDots size={24} />
      </Button>
    </>
  );
};

export default ChatButton;