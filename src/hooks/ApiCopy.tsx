import axios from 'axios';
import config from '../config/baseUrl';

export const copyCardList = async (data: {
  sourceCardListId: string;
  targetCardId: string;
  name?: string;
  memberIds?: string[];
  includeChecklists: boolean;
  includeCustomFields: boolean;
  includeAttachments: boolean;
  includeLabels: boolean;
}) => {
  try {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(`${config}/cardlist/copy`, data, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};