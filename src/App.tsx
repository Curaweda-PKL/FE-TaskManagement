import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Pages/Layout';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Component/ResetPassword';
import HomePage from './Pages/HomePage';
import Boards from './Pages/Boards';
import Home from './Pages/Home';
import WorkspaceBoards from './Pages/WorkspaceBoards';
import WorkspaceHighlights from './Pages/WorkspaceHighlights';
import WorkspaceReports from './Pages/WorkspaceReports';
import WorkspaceMembers from './Pages/WorkspaceMembers';
import WorkspaceSettings from './Pages/WorkspaceSettings';
import useAuth from './hooks/fetchAuth';

function App() {
  const { isLoggedIn } = useAuth(() => {});

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
<<<<<<< Updated upstream
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
=======
>>>>>>> Stashed changes
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route 
            path="/boards" 
            element={isLoggedIn ? <Boards /> : <Navigate to="/signin" replace />} 
          />
          <Route path="/workspace/boards" element={<WorkspaceBoards />} />
          <Route path="/workspace/highlights" element={<WorkspaceHighlights />} />
          <Route path="/workspace/reports" element={<WorkspaceReports />} />
          <Route path="/workspace/members" element={<WorkspaceMembers />} />
          <Route path="/workspace/settings" element={<WorkspaceSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;