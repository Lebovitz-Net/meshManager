// src/components/Navigation/TopToolbar.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Switch,
  TextField,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function TopToolbar({ nodeName, activeTab, threadedView, onThreadToggle }) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Connection context */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MeshView — Connected to {nodeName || 'Unknown Node'}
        </Typography>

        {/* Contextual controls */}
        {activeTab === 'messages' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search messages"
            />
            <Typography variant="body2">Threaded</Typography>
            <Switch
              checked={threadedView}
              onChange={onThreadToggle}
              color="default"
            />
          </Box>
        )}

        {activeTab === 'contacts' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">Add Contact</Button>
            <Button variant="outlined" size="small">Sort</Button>
          </Box>
        )}

        {activeTab === 'nodes' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">Refresh</Button>
            <Button variant="outlined" size="small">Diagnostics</Button>
          </Box>
        )}

        {activeTab === 'channels' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">Add Channel</Button>
            <Button variant="outlined" size="small">Manage</Button>
          </Box>
        )}

        {activeTab === 'connections' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">New Connection</Button>
            <Button variant="outlined" size="small">Settings</Button>
          </Box>
        )}

        {activeTab === 'map' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">Zoom</Button>
            <Button variant="outlined" size="small">Layers</Button>
          </Box>
        )}

        {/* Global menu */}
        <IconButton color="inherit">
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopToolbar;
