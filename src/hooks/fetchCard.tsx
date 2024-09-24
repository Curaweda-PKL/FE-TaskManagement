import axios from 'axios';
import config from '../config/baseUrl';

export const fetchCard = async (boardId: any) => {
    try {
      const response = await axios.get(config + "/card/take/" + boardId, {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json' 
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      throw error;
    }
  };
  export const updateCard = async (cardId: any, name: any) => {
    try {
      const response = await axios.put(
        config + "/card/update",
        {cardId, name},
        {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json' 
          }
        }
      );
  
      return response.data;  
    } catch (error) {
      console.error('Failed to update board:', error);
      throw error;
    }
  };
  export const createCard = async (boardId: any, name: any) => {
    try {
      const response = await axios.post(
        config + "/card/create",
        { boardId, name },
        {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json' 
          }
        }
      );
  
      return response.data;  
    } catch (error) {
      console.error('Failed to create board:', error);
      throw error;
    }
  };
  export const deleteCard = async (cardId: any) => {
    try {
      const response = await axios.delete(
        `${config}/card/delete`,
        {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          data: { cardId }
        }
      );
  
      return response.data;  
    } catch (error) {
      console.error('Failed to delete board:', error);
      throw error;
    }
  };