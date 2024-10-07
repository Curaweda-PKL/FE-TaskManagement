import axios from 'axios';
import config from '../config/baseUrl';

export const fetchLabels = async (workspaceId: string) => {
    try {
        const response = await axios.get(`${config}/cardlist/take-labels/${workspaceId}`, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch labels:', error);
        throw error;
    }
};
export const createCardListLabel = async (workspaceId: string, name: string, color: string) => {
    try {
        const response = await axios.post(config + "/cardlist/create-labels", {
            workspaceId,
            name,
            color
        }, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to create card list label:', error);
        throw error;
    }
};
export const updateCardListLabel = async (labelId: string, name: string, color: string) => {
    try {
        const response = await axios.put(config + "/cardlist/update-Labels", {
            labelId,
            name,
            color
        }, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to update card list label:', error);
        throw error;
    }
};
export const addLabelToCardList = async (cardListId: string, labelId: string) => {
    try {
        const response = await axios.post(config + "/cardlist/add-label", {
            cardListId,
            labelId
        }, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to add label to card list:', error);
        throw error;
    }
};
export const deleteLabelFromWorkspace = async (cardlistLabelId: string) => {
    try {
        const response = await axios.delete(`${config}/cardlist/remove-label/${cardlistLabelId}`, {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to remove label from card list:', error);
        throw error;
    }
};
export const fetchCardListLabels = async (cardListId: string) => {
    try {
      const response = await axios.get(`${config}/cardlist/take-label-cl/${cardListId}`, {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Failed to fetch card list labels:', error);
      throw error;
    }
  };
  export const removeLabelFromCardList = async (labelId: string, cardListId: string) => {
    try {
      const response = await axios.delete(`${config}/cardlist/remove-label-cl`, {
        data: {
          labelId,
          cardListId
        },
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Failed to remove label from card list:', error);
      throw error;
    }
  };