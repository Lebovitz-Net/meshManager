import { Typography } from '@mui/material';

export default function MessageDetails({ message }) {
  let mentions = [];
  try {
    if (message.mentions) {
      mentions = JSON.parse(message.mentions);
    }
  } catch (err) {
    console.warn("Invalid mentions JSON:", message.mentions);
  }

  let options;
  try {
    if (message.options) {
      options = JSON.parse(message.options);
    }
  } catch (err) {
    console.warn("Invalid options JSON:", message.options);
  }

  return (
    <>
      <Typography variant="body2">
        Sent: {message.sentTimestamp
          ? new Date(message.sentTimestamp * 1000).toLocaleString()
          : '—'}
      </Typography>
      <Typography variant="body2">
        Received: {message.recvTimestamp
          ? new Date(message.recvTimestamp * 1000).toLocaleString()
          : '—'}
      </Typography>
      <Typography variant="body2">Channel ID: {message.channelId}</Typography>
      <Typography variant="body2">Sender: {message.sender || message.contactId}</Typography>
      <Typography variant="body2">Message ID: {message.messageId}</Typography>
      <Typography variant="body2">Protocol: {message.protocol}</Typography>
      {mentions.length > 0 && (
        <Typography variant="body2">
          Mentions: {mentions.join(', ')}
        </Typography>
      )}
      {options && (
        <Typography variant="body2">
          Options: {JSON.stringify(options)}
        </Typography>
      )}
      <Typography variant="body2">Conn ID: {message.connId}</Typography>
      <Typography variant="body2">Raw Message: {message.message}</Typography>
    </>
  );
}
