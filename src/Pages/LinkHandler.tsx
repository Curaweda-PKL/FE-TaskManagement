import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LinkHandler = () => {
  const { workspaceId, boardId, cardListId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageAndNavigation = async () => {
      if (workspaceId && boardId) {
        localStorage.setItem('onWorkspace', workspaceId);
        localStorage.setItem('onBoardId', boardId);
        if (cardListId) {
          localStorage.setItem('oncardList', cardListId);
        }
        navigate(`/workspace/${workspaceId}/board/${boardId}`, { replace: true });
        window.location.reload();
      }
    };

    handleStorageAndNavigation();
  }, []);

  return null; // Component ini hanya untuk logic, tidak perlu render apapun
};

export default LinkHandler;