import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinWithLinkWorkspace } from '../hooks/fetchWorkspace';

const JoinWorkspace = () => {
  const { joinLink } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const joinWorkspace = async () => {
      try {
        await joinWithLinkWorkspace(joinLink);
        navigate(`/workspace/${joinLink}/boards`);
      } catch (error) {
        console.error('Failed to join workspace:', error);
      }
    };

    joinWorkspace();
  }, [joinLink, navigate]);

  return (
    <div>
      <h1>Joining workspace...</h1>
    </div>
  );
};

export default JoinWorkspace;
