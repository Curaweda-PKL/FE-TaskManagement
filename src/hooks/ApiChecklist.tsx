import axios from 'axios';
import config from '../config/baseUrl';

export const createChecklist = async (data: {
  checklistData: {
    cardListId: string;
    name: string;
    startDate?: string;
    endDate?: string;
    items: {
      name: string;
      isDone: boolean;
    }[];
  }
}) => {
  try {
    const headers = {
      'Authorization': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    };

    const response = await axios.post(`${config}/cardlist/checklist/createCheckList`, data, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateChecklist = async (data: {
  idChecklist: string;
  checklistData: {
    name: string;
    startDate?: string;
    endDate?: string;
    items: {
      name: string;
      isDone: boolean;
    }[];
  };
}) => {
  try {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.put(`${config}/cardlist/checklist/updateCheckList`, data, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const takeCardListChecklist = async (cardListId: string) => {
  try {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.get(`${config}/cardlist/checklist/take-CardList-cl/${cardListId}`, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteChecklist = async (idChecklist: string) => {
  try {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.delete(`${config}/cardlist/checklist/deleteCheckList`, { headers, data: { idChecklist } });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};