import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MessageDetails from './MessageDetails.jsx';

export default function MessageCard({ message, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(prev => !prev);

  // Build display name with fallback
  const displayName =
    message.sender || message.contactId
      ? `${message.sender || message.contactId}`
      : `Node ${message.fromNodeNum}`;

  return (
    <Card
      sx={{
        mb: 1,
        cursor: 'pointer',
        border: isSelected ? '2px solid #1976d2' : '1px solid #ccc',
        backgroundColor: isSelected ? '#f1f8e9' : '#fff',
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={onSelect}
    >
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div onClick={handleToggle} style={{ cursor: 'pointer', flex: 1 }}>
          {/* User identity block */}
          <Stack spacing={0.3}>
            <Typography variant="subtitle1" fontWeight="bold">
              {displayName}
            </Typography>
            {message.contactId && (
              <Typography variant="caption" color="text.secondary">
                Contact ID: {message.contactId}
              </Typography>
            )}
          </Stack>

          {/* Message routing info */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            From: {message.fromNodeNum || message.sender} → To: {message.toNodeNum}
          </Typography>

          {/* Message preview */}
          <Typography variant="body1" noWrap>
            {message.message}
          </Typography>

          {/* Timestamps */}
          <Typography variant="caption" color="text.secondary">
            {`Send: ${new Date(message.sentTimestamp).toLocaleString()}`}
          </Typography>

          {/* Add spacing between sent and received */}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {`Received: ${new Date(message.recvTimestamp).toLocaleString()}`}
          </Typography>

        </div>

        <IconButton
          onClick={handleToggle}
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Pass full enriched message object down */}
          <MessageDetails message={message} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
