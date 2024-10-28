import axios from 'axios';
import config from '../config/baseUrl';

export const getTaskBar = async (workspaceId: String) => {
  try {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.get(`${config}/report/${workspaceId}/taskBar`, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};