import axios from 'axios';
import config from '../config/baseUrl';

export const fetchWorkspaces = async () => {
  try {
    const response = await axios.get(config + '/workspace/myWorkspace', {
      headers: {
        'Authorization': localStorage.getItem('token'),
      }
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error('Failed to fetch workspaces:', error);
    throw error;  
  }
};
