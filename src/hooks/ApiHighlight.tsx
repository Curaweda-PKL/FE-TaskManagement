import axios from 'axios';
import config from '../config/baseUrl';

export const getHighlightUser  = async (): Promise<any> => {
    try {
      const response = await axios.get(
        `${config}/highlight/user`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch highlight user:', error);
      return null;
    }
  };
  
  export const getHighlightWorkspace = async (workspaceId: string): Promise<any> => {
    try {
      const response = await axios.get(
        `${config}/highlight/workspace/${workspaceId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch highlight workspace:', error);
      return null;
    }
  };
  
  export const postHighlightCommentReply = async (commentId: string, content: string): Promise<any> => {
    try {
      const response = await axios.post(
        `${config}/highlight/comments/reply/${commentId}`,
        {
          content: content,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      return response.data;
    } catch (error: any) {
      console.error('Failed to post highlight comment reply:', error);
      return null;
    }
  };