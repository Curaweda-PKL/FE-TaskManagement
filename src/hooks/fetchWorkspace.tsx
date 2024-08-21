import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

const useWorkspace = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config}/workspace/myMyworkspace`, {
          headers: {
            Authorization: token,
          },
        });
        setBoards(response.data.result);
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspace();
  }, []);

  return {
    boards,
    setBoards,
    isLoading,
  };
};

export default useWorkspace;
