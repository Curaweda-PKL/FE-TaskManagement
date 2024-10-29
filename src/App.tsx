import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Component/Layout';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import HomePage from './Pages/HomePage';
import Boards from './Pages/Workspace';
import Home from './Pages/Home';
import WorkspaceBoards from './Pages/WorkspaceBoards';
import WorkspaceHighlights from './Pages/WorkspaceHighlights';
import WorkspaceReports from './Pages/WorkspaceReports';
import WorkspaceMembers from './Pages/WorkspaceMembers';
import WorkspaceSettings from './Pages/WorkspaceSettings';
import WorkspaceProject from './Pages/WorkspaceCard';
import JoinWorkspace from './Component/joinWorkspace';
import useAuth from './hooks/fetchAuth';
import LayoutWorkspace from './Component/LayoutWorkspace';
import Profile from './Pages/Profile';
import WorkspaceCardList from './Pages/WorkspaceCardList';
import LinkHandler from './Pages/LinkHandler';


function App() {
  const { isLoggedIn } = useAuth(() => {}, () => {});

  return (
    <Router>
      <Routes>
      <Route path="/L/workspace/:workspaceId/board/:boardId" element={<LinkHandler />} />
        <Route path="/j/:joinLink" element={<JoinWorkspace />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/r/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/signin" replace />} />
        <Route element={<Layout />}>
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/signin" replace />} />
          <Route path="/boards" element={isLoggedIn ? <Boards /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/:workspaceId/boards" element={isLoggedIn ? <WorkspaceBoards /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/:workspaceId/highlights" element={isLoggedIn ? <WorkspaceHighlights /> : <Navigate to="/signin" replace />} />        
        </Route>
        <Route element={<LayoutWorkspace />}>
          <Route path="/workspace/:workspaceId/boards-ws" element={isLoggedIn ? <WorkspaceBoards /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/:workspaceId/reports" element={isLoggedIn ? <WorkspaceReports /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/:workspaceId/members" element={isLoggedIn ? <WorkspaceMembers /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/:workspaceId/settings" element={isLoggedIn ? <WorkspaceSettings /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/:workspaceId/board/:boardId" element={isLoggedIn ? <WorkspaceProject /> : <Navigate to="/signin" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;