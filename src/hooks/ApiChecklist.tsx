import axios from 'axios';
import config from '../config/baseUrl';

export const createChecklist = async (data: { checklistData: {
  cardListId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  items: {
    name: string;
    isDone: boolean;
  }[];
}}) => {
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