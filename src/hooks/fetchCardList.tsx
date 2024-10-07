import axios from 'axios';
import config from '../config/baseUrl';

export const fetchCardList = async (cardId: string) => {
  try {
    const response = await axios.get(`${config}/cardList/take/${cardId}`, {
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });

    const cardLists = response.data;

    // Fetch attachments for each card list
    const cardListsWithAttachments = await Promise.all(cardLists.map(async (cardList: any) => {
      const attachments = await Promise.all(
        cardList.attachments.map(async (attachment: any) => {
          try {
            const attachmentDetails = await fetchCardListAttachments(attachment.attachmentId);
            return attachmentDetails;
          } catch (error) {
            console.error(`Failed to fetch attachment ${attachment.attachmentId}:`, error);
            return null;
          }
        })
      );

      // Filter out failed attachment fetches
      cardList.attachmentDetails = attachments.filter(att => att !== null);
      return cardList;
    }));

    return cardListsWithAttachments;
  } catch (error) {
    console.error('Failed to fetch card lists:', error);
    throw error;
  }
};

export const createCardList = async (cardId: any, name: any, description: any, score: any) => {
  try {
    const response = await axios.post(
      config + "/cardlist/create",
      { cardId, name, score, description},
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      throw error;
    }
  };

export const updateCardList = async (id: any, name: any, description: any, score: any) => {
  try {
    const response = await axios.put(
      config + "/cardlist/update",
      { id, name, score, description },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      throw error;
    }
  };
  
export const deleteCardList = async (cardListId: any) => {
  try {
    const response = await axios.delete(
      `${config}/cardlist/delete`,
      {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        data: { id: cardListId }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to delete board:', error);
    throw error;
  }
}

export const getMemberCardList = async (id: any) => {
  try {
    const response = await axios.post(
      `${config}/cardlist/take-Member/${id}`,
      { id },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to join card list:', error);
    throw error;
  }
};

export const joinCardList = async (cardListId: any, userId: any) => {
  try {
    const response = await axios.post(
      `${config}/cardlist/join-cardlist/${cardListId}`,
      { cardListId, userId },
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to join card list:', error);
    throw error;
  }
};

export const outCardList = async (cardListId: any, userId: any) => {
  try {
    const response = await axios.delete(
      `${config}/cardlist/out-cardlist`,
      {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        data: { cardListId, userId }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to delete card list:', error);
    throw error;
  }
}

export const fetchCardListAttachments = async (attachmentId: string): Promise<Blob> => {
  try {
    const response = await axios.get(
      `${config}/cardlist/takeAttachment/${attachmentId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob'
      }
    );
    const blobUrl = URL.createObjectURL(response.data);
    console.log(response.data);
    console.log(blobUrl);
    return blobUrl;
  } catch (error: any) {
    console.error('Failed to fetch card list attachments:', error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to fetch card list attachments. Please try again.');
    }
  }
};

export const createAttachment = async (cardListId: string, file: File, attachmentName: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('attachmentName', attachmentName);
    formData.append('cardListId', cardListId);

    const response = await axios.post(
      `${config}/cardlist/createAttachment?cardListId=${cardListId}`,
      formData,
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
        }
      }
    );
    
    return {
      ...response.data,
      name: attachmentName
    };
  } catch (error) {
    console.error('Failed to create attachment:', error);
    throw error;
  }
};

export const deleteAttachment = async (cardListId: string, attachmentId: string) => {
  try {
    const response = await axios.delete(
      `${config}/cardlist/deleteAttachment/${attachmentId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: response.status === 200,
      message: response.data.message || 'Attachment deleted successfully'
    };
  } catch (error: any) {
    console.error('Failed to delete attachment:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete attachment',
      error
    };
  }
};
