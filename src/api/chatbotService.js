import axios from 'axios';

// Base URL for API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Get conversation history
export const getConversationHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/conversations/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }
};

// Save message to database
export const saveMessage = async (userId, message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/conversations/message`, {
      userId,
      message
    });
    return response.data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// Get AI response
export const getAIResponse = async (userId, message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
      userId,
      message
    });
    return response.data;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
};