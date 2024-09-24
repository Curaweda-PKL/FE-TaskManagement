import axios from 'axios';
import config from '../config/baseUrl';

export const fetchCardList = async (cardId: any) => {
    try {
      const response = await axios.get(config + "/cardList/take/" + cardId, {
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
  export const updateCardList = async (cardId: any, boardId: any, name: any, description: any, score: any, startDate: any, endDate: any) => {
    try {
      const response = await axios.put(
        config + "/cardlist/update",
        {cardId, name, boardId, score, startDate, endDate, description},
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
  export const createCardList = async (cardId: any, boardId: any, name: any, description: any, score: any, startDate: any, endDate: any) => {
    try {
      const response = await axios.post(
        config + "/cardlist/create",
        { boardId, name, cardId, description, score, startDate, endDate},
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
export const deleteCardList = async (cardId: any) => {
    try {
      const response = await axios.delete(
        `${config}/cardlist/delete`,
        {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          data: {cardId}
        }
      );
  
      return response.data;  
    } catch (error) {
      console.error('Failed to delete board:', error);
      throw error;
    }
  }