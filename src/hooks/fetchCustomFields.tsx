import axios from 'axios';
import config from '../config/baseUrl';

export const fetchCustomFields = async (workspaceId: any) => {
  try {
    const response = await axios.get(`${config}/workspace/take-customField/${workspaceId}`, {
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch custom fields:', error);
    throw error;
  }
};

export const createCustomField = async (workspaceId: any, name: string, type: string, value: string) => {
  try {
    const response = await axios.post(
      `${config}/workspace/create-customField`,
      { workspaceId, name, type, value },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to create custom field:', error);
    throw error;
  }
};

export const updateCustomField = async (customFieldId: any, name: string, type: string, value: string) => {
  try {
    const response = await axios.put(
      `${config}/workspace/update-customField`,
      { customFieldId, name, type, value },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to update custom field:', error);
    throw error;
  }
};

export const deleteCustomField = async (customFieldId: any) => {
  try {
    const response = await axios.delete(`${config}/workspace/delete-customField/${customFieldId}`, {
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to delete custom field:', error);
    throw error;
  }
};

export const createCustomFieldOption = async (customFieldId: any, value: string, color: string) => {
  try {
    const response = await axios.post(
      `${config}/workspace/create-fieldOption`,
      { customFieldId, value, color },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to create custom field option:', error);
    throw error;
  }
};

export const updateCustomFieldOption = async (customFieldOptionId: any, value: string, color: string) => {
  try {
    const response = await axios.put(
      `${config}/workspace/update-fieldOption`,
      { customFieldOptionId, value, color },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to update custom field option:', error);
    throw error;
  }
};

export const deleteCustomFieldOption = async (customFieldOptionId: any) => {
  try {
    const response = await axios.delete(`${config}/workspace/delete-fieldOption/${customFieldOptionId}`, {
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to delete custom field option:', error);
    throw error;
  }
};

export const fetchCardlistCustomFields = async (workspaceId: any) => {
  try {
    const response = await axios.get(`${config}/cardlist/customfield/take-customField/${workspaceId}`, {
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch cardlist custom fields:', error);
    throw error;
  }
};

export const addCardlistCustomField = async (cardListId: any, customFieldId: any) => {
  try {
    const response = await axios.post(
      `${config}/cardlist/customfield/add-customField`,
      { cardListId, customFieldId },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to add custom field to cardlist:', error);
    throw error;
  }
};

export const removeCardlistCustomField = async (cardListOnCustomFieldId: any, cardListId: any) => {
  try {
    const response = await axios.delete(
      `${config}/cardlist/customfield/remove-customField`,
      {
        data: { id: cardListOnCustomFieldId, cardListId },
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to remove custom field from cardlist:', error);
    throw error;
  }
};

export const updateCardlistCustomFieldValue = async (cardListId: any, customFieldId: any, value: string) => {
  try {
    const response = await axios.put(
      `${config}/cardlist/customfield/update-value`,
      { cardListId, customFieldId, value },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to update custom field value for cardlist:', error);
    throw error;
  }
};

