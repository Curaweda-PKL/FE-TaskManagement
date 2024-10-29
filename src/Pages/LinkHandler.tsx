import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LinkHandler = () => {
  const { workspaceId, boardId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (workspaceId && boardId) {
      // Simpan ke localStorage
      localStorage.setItem('onWorkspace', workspaceId);
      localStorage.setItem('onBoardId', boardId);

      // Redirect ke halaman workspace/board yang sesuai
      navigate(`/workspace/${workspaceId}/board/${boardId}`, { replace: true });
      
      // Refresh halaman
      window.location.reload();
    }
  }, []);

  return null; // Component ini hanya untuk logic, tidak perlu render apapun
};

export default LinkHandler;