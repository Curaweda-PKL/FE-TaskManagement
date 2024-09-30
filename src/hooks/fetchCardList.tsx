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
  export const updateCardList = async ( id: any, name: any, description: any, score: any) => {
    try {
      const response = await axios.put(
        config + "/cardlist/update",
        {id, name, score, description},
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
  export const createCardList = async (cardId: any, name: any, description: any, score: any) => {
    try {
      const response = await axios.post(
        config + "/cardlist/create",
        { name, cardId, description, score},
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
export const deleteCardList = async (cardListId: any) => {
    try {
      const response = await axios.delete(
        `${config}/cardlist/delete`,
        {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          data: {id: cardListId}
        }
      );
  
      return response.data;  
    } catch (error) {
      console.error('Failed to delete board:', error);
      throw error;
    }
  }