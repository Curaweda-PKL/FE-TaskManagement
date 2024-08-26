import axios from 'axios';
import config from '../config/baseUrl';

export const fetchBoards = async (workspaceId: any) => {
  try {
    const response = await axios.post(
      config + "/board/takeBoard",
      { workspaceId },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json' 
        }
      }
    );

    return response.data;  
  } catch (error) {
    console.error('Failed to fetch boards:', error);
    throw error;
  }
};
export const updateBoard = async (boardId: any, name: any, description: any) => {
  try {
    const response = await axios.put(
      config + "/board/updateBoard",
      { boardId, name, description },
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
export const createBoard = async (workspaceId: any, name: any, description: any) => {
  try {
    const response = await axios.post(
      config + "/board/createBoard",
      { workspaceId, name, description },
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

export const deleteBoard = async (boardId: any) => {
  try {
    const response = await axios.delete(
      `${config}/board/deleteBoard`,
      {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        data: { boardId }
      }
    );

    return response.data;  
  } catch (error) {
    console.error('Failed to delete board:', error);
    throw error;
  }
};