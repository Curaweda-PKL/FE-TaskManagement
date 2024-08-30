import axios from 'axios';
import config from '../config/baseUrl';

export const fetchBoards = async (workspaceId: any) => {
  try {
    const response = await axios.get(config + "/board/take/" + workspaceId, {
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
export const updateBoard = async (workspaceId: any, boardId: any, name: any, description: any) => {
  try {
    const response = await axios.put(
      config + "/board/update",
      { workspaceId, boardId, name, description },
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
export const createBoard = async (workspaceId: string, name: string, description: string) => {
  try {
    const response = await axios.post(
      config + "/board/create",
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

export const deleteBoard = async (workspaceId: any, boardId: any) => {
  try {
    const response = await axios.delete(
      `${config}/board/delete`,
      {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        data: { workspaceId, boardId }
      }
    );

    return response.data;  
  } catch (error) {
    console.error('Failed to delete board:', error);
    throw error;
  }
};