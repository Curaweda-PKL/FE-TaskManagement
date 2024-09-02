  import axios from 'axios';
  import config from '../config/baseUrl';

  export const fetchWorkspaces = async (workspaceId: any) => {
    try {
      const response = await axios.get(
        config + '/workspace/take',      {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      throw error;  
    }
  };

  export const createWorkspace = async (name: any, description: any, ownerId: any) => {
    try {
      const response = await axios.post(
        config + "/workspace/create",
        { name, description, ownerId },
        {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json' 
          }
        }
      );
      window.location.reload();
      return response.data;  
    } catch (error) {
      console.error('Failed to create workspace:', error);
      throw error;
    }
  };

  export const updateWorkspace = async (workspaceId: any, name: any, description: any, ownerId: any) => {
    try {
      const response = await axios.put(
        config + "/workspace/update",
        { workspaceId, name, description, ownerId },
        {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json' 
          }
        }
      );
      window.location.reload();
      return response.data;  
    } catch (error) {
      console.error('Failed to create workspace:', error);
      throw error;
    }
  };

  export const deleteWorkspace = async (workspaceId: any) => {
    try {
      const response = await axios.delete(
        `${config}/workspace/delete`,
        {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          data: { workspaceId }
        }
      );

      return response.data;  
    } catch (error) {
      console.error('Failed to delete board:', error);
      throw error;
    }
  };