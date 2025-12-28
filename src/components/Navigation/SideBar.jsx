// src/components/Navigation/Sidebar.jsx
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const tabs = [
    { label: 'Nodes', path: '/nodes' },
    { label: 'Messages', path: '/messages' },
    { label: 'Contacts', path: '/contacts' },
    { label: 'Channels', path: '/channels' },     // ✅ placeholder
    { label: 'Connections', path: '/connections' }, // ✅ placeholder
    { label: 'Map', path: '/map' },               // ✅ placeholder
  ];

  return (
    <nav
      className="sidebar"
      style={{ width: '250px', background: '#f4f4f4', padding: '1rem' }}
    >
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tabs.map(({ label, path }) => (
          <li key={path} style={{ marginBottom: '1rem' }}>
            <NavLink
              to={path}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#007bff' : '#333',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
