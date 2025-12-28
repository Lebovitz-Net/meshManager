// src/pages/HomePage.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Navigation/Sidebar.jsx';
import Topbar from '@/components/Navigation/Topbar.jsx';
import TopToolbar from '@/components/Navigation/TopToolbar.jsx';

import NodesTab from '@/components/Tabs/NodesTab.jsx';
import ContactsTab from '@/components/Tabs/ContactsTab.jsx';
import MessagesTab from '@/components/Tabs/MessagesTab.jsx';

const HomePage = ({ activeNode }) => {
  const location = useLocation();

  // Derive activeTab from pathname for dynamic TopToolbar
  const activeTab = (() => {
    if (location.pathname.startsWith('/contacts')) return 'contacts';
    if (location.pathname.startsWith('/messages')) return 'messages';
    if (location.pathname.startsWith('/nodes')) return 'nodes';
    return '';
  })();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Global Topbar */}
        <Topbar />

        {/* Dynamic TopToolbar */}
        <TopToolbar nodeName={activeNode?.name} activeTab={activeTab} />

        {/* Routed tab content */}
        <main style={{ flexGrow: 1, padding: '2rem', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="messages" />} />
            <Route path="nodes" element={<NodesTab />} />
            <Route
              path="contacts"
              element={<ContactsTab nodeNum={activeNode?.myNodeNum} />}
            />
            <Route path="messages" element={<MessagesTab />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
