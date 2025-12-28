// File: src/components/Tabs/ContactsCard.jsx
import { Card, CardContent, Typography } from '@mui/material';

export default function ContactsCard({ contact, isSelected, onSelectContact }) {
  console.log(".../ContactsCard contact", contact);

  // Safely parse position JSON if present
  let lat, lon;
  try {
    if (contact.position) {
      const pos = JSON.parse(contact.position);
      lat = pos.advLat ?? pos.lat;
      lon = pos.advLon ?? pos.lon;
    }
  } catch (err) {
    console.warn("Invalid position JSON for contact:", contact.position);
  }

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        border: isSelected ? '2px solid #1976d2' : '1px solid #ccc',
        backgroundColor: isSelected ? '#e3f2fd' : '#fff',
        transition: 'all 0.2s ease-in-out',
      }}
      onClick={() => onSelectContact(contact)}
    >
      <CardContent>
        <Typography variant="h6">
          {contact.name || contact.shortName || 'Unnamed Contact'}
        </Typography>
        <Typography variant="body2">Contact ID: {contact.contactId}</Typography>
        {contact.nodeNum !== undefined && (
          <Typography variant="body2">Node #: {contact.nodeNum}</Typography>
        )}
        {contact.publicKey && (
          <Typography variant="body2">Key: {contact.publicKey}</Typography>
        )}
        {contact.protocol !== undefined && (
          <Typography variant="body2">Protocol: {contact.protocol}</Typography>
        )}
        {contact.timestamp && (
          <Typography variant="body2">
            Updated: {new Date(contact.timestamp * 1000).toLocaleString()}
          </Typography>
        )}
        {lat !== undefined && lon !== undefined && (
          <Typography variant="body2">
            Position: {lat}, {lon}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
