import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Pages/Layout';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import HomePage from './Pages/HomePage';
import Boards from './Pages/Boards';
import Home from './Pages/Home';
import WorkspaceBoards from './Pages/WorkspaceBoards';
import WorkspaceHighlights from './Pages/WorkspaceHighlights';
import WorkspaceReports from './Pages/WorkspaceReports';
import WorkspaceMembers from './Pages/WorkspaceMembers';
import WorkspaceSettings from './Pages/WorkspaceSettings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/boards" element={<Boards />} />
          <Route path="/home" element={<Home />} />
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