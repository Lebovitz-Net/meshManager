// src/pages/MessageListPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import MessageList from '@/components/Tabs/MessageList.jsx';
import useMessages from '@/hooks/useMessages.js';

export default function MessageListPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { messages, loading, error } = useMessages();

  if (loading) {
    return (
      <div style={{ padding: '1rem' }}>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1rem' }}>
        <p style={{ color: 'red' }}>Error loading messages: {error.message}</p>
      </div>
    );
  }

  // Filter messages by channel if channelId is present
  const filteredMessages = channelId
    ? messages.filter((m) => m.channelId === channelId)
    : messages;

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/messages')}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1rem',
          color: '#007bff',
          marginBottom: '1rem',
          cursor: 'pointer',
        }}
      >
        ← Back to Messages
      </button>

      <h2 style={{ marginBottom: '1rem' }}>
        {channelId ? `Messages for Channel ${channelId}` : 'All Messages'}
      </h2>

      <MessageList messages={filteredMessages} />
    </div>
  );
}
