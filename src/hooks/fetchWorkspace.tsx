import axios from 'axios';
import config from '../config/baseUrl';

export const fetchWorkspaces = async (_workspaceId: any) => {
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

export const createWorkspace = async (name: any, description: any, ownerId: any, color:any) => {
  try {
    const response = await axios.post(
      config + "/workspace/create",
      { name, description, ownerId, color },
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

export const updateWorkspace = async (
  workspaceId: string,
  name: string,
  description: string,
  color: string,
  ownerId: string,
  isPublic: boolean
) => {
  try {
    const response = await axios.put(
      `${config}/workspace/update`,
      { workspaceId, name, description, color, ownerId, isPublic },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );
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

export const getProfilePhotoMember = async (userId: any): Promise<any> => {
  try {
    const response = await axios.get(
      `${config}/user/get-PhotoProfile/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob'
      }
    );


    const blobUrl = URL.createObjectURL(response.data);


    return blobUrl;
  } catch (error: any) {
    console.error('Failed to fetch profile photo:', error);
    return null
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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
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
      { requestId, status },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to process join request:', error);
    throw error;
  }
};


export const joinWithLinkWorkspace = async (link: any) => {
  try {
    const response = await axios.post(
      `${config}/workspace/join-with-link`,
      { link },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
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

export const removeMemberWorkspace = async (workspaceId: any, memberId: any) => {
  try {
    const response = await axios.delete(
      `${config}/workspace/remove-member`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        data: { workspaceId, memberId }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to remove member from workspace:', error);
    throw error;
  }
};

export const getWorkspace = async (workspaceId: any) => {
  try {
    const response = await axios.get(
      `${config}/report/workspace/${workspaceId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error('Failed to get workspace:', error);
    throw error;
  }
};

export const getWorkspaceRanks = async (workspaceId: any, startDate: string, endDate: string) => {
  try {
    const response = await axios.get(
      `${config}/report/workspace/${workspaceId}/ranks`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        params: {
          startDate,
          endDate
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error('Failed to get workspace ranks', error);
    throw error;
  }
};

export const getBoardRanks = async (boardId: any, startDate: string, endDate: string) => {
  try {
    const response = await axios.get(
      `${config}/report/board/${boardId}/ranks`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        params: {
          startDate,
          endDate
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error('Failed to get board ranks', error);
    throw error;
  }
};