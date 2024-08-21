import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Component/Layout';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import HomePage from './Pages/HomePage';
import Boards from './Pages/Boards';
import Home from './Pages/Home';
import WorkspaceBoards from './Pages/WorkspaceBoards';
import WorkspaceHighlights from './Pages/WorkspaceHighlights';
import WorkspaceReports from './Pages/WorkspaceReports';
import WorkspaceMembers from './Pages/WorkspaceMembers';
import WorkspaceSettings from './Pages/WorkspaceSettings';
import WorkspaceProject from './Pages/WorkspaceProject';
import useAuth from './hooks/fetchAuth';
import LayoutWorkspace from './Component/LayoutWorkspace';
import Profile from './Pages/Profile';


function App() {
  const { isLoggedIn } = useAuth(() => {});

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/signin" replace />} />
        <Route element={<Layout />}>
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/signin" replace />} />
          <Route path="/boards" element={isLoggedIn ? <Boards /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/boards" element={isLoggedIn ? <WorkspaceBoards /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/highlights" element={isLoggedIn ? <WorkspaceHighlights /> : <Navigate to="/signin" replace />} />        
        </Route>
        <Route element={<LayoutWorkspace />}>
          <Route path="/workspace/boards-ws" element={isLoggedIn ? <WorkspaceBoards /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/reports" element={isLoggedIn ? <WorkspaceReports /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/members" element={isLoggedIn ? <WorkspaceMembers /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/settings" element={isLoggedIn ? <WorkspaceSettings /> : <Navigate to="/signin" replace />} />
          <Route path="/workspace/project" element={isLoggedIn ? <WorkspaceProject /> : <Navigate to="/signin" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;