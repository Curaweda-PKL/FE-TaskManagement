import axios from 'axios';
import config from '../config/baseUrl';

export const fetchWorkspaces = async (workspaceId: any) => {
  try {
    const response = await axios.get(
      config + '/workspace/take', {
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

export const updateWorkspace = async (workspaceId: any, name: any, description: any, ownerId: any, isPublic: any) => {
  try {
    const response = await axios.put(
      config + "/workspace/update",
      { workspaceId, name, description, ownerId, isPublic },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );
    window.location.reload
    return response.data;
  } catch (error) {
    console.error('Failed to update workspace:', error);
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

export const memberWorkspace = async (workspaceId: any) => {
  try {
    const response = await axios.get(
      config + "/workspace/member/" + workspaceId,
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to get workspace members', error);

    throw error;
  }
};

export const joinWorkspace = async (workspaceId: any) => {
  try {
    const response = await axios.post(
      config + "/workspace/join",
      { workspaceId },
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
    console.error('Failed to join workspace:', error);
    throw error;
  }
};

export const requestJoinWorkspace = async (workspaceId: any) => {
  try {
    const response = await axios.post(
      config + "/workspace/request-join",
      { workspaceId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include Bearer before the token
          'Content-Type': 'application/json'
        }
      }
    );
    window.location.reload();
    return response.data;
  } catch (error) {
    console.error('Failed to join workspace:', error);
    throw error;
  }
};

export const requestWorkspace = async (requestId: any, status: any) => {
  try {
    const response = await axios.put(
      `${config}/workspace/request`,
      {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        data: { requestId, status }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to join workspace:', error);
    throw error;
  }
};

export const joinWithLinkWorkspace = async (link: any) => {
  try {
    const response = await axios.post(
      `${config}/workspace/join-with-link`,
      {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        data: { link }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to join workspace:', error);
    throw error;
  }
};

export const generateLinkWorkspace = async (workspaceId: any) => {
  try {
    const response = await axios.post(
      `${config}/workspace/generate-link`,
      { workspaceId },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to generate join link for workspace:', error);
    throw error;
  }
};

export const joinRequestsWorkspace = async (workspaceId: any) => {
  try {
    const response = await axios.get(
      config + "/workspace/join-requests/" + workspaceId,
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetching  join request for workspace:', error);
    throw error;
  }
};
