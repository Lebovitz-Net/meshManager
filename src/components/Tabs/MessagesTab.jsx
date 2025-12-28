// File: src/components/Tabs/MessagesTab.jsx
import { useState, useMemo, useCallback } from 'react';
import { Box, Tabs, Tab, Typography, CircularProgress } from '@mui/material';
import MessageList from './MessageList.jsx';
import ThreadedMessageList from './MessageThreadedList.jsx';
import MessageComposer from './MessageComposer.jsx';
import useMessages from '@/hooks/useMessages.js';
import useChannels from '@/hooks/useChannels.js';
import useSSE from '@/hooks/useSSE.js';
import { useMyInfo } from '@/hooks/useMyInfo.js';

export default function MessagesTab() {
  const [selectedChannel, setSelectedChannel] = useState(null);

  const { messages, loading, error, refetch, appendMessage } = useMessages({
    channelId: selectedChannel,
    sinceDate: 0,
  });

  const { channels } = useChannels();
  const { myInfo } = useMyInfo();

  // compute lastSeenTimestamp from current messages
  const lastSeenTimestamp = useMemo(() => {
    if (!messages || messages.length === 0) return 0;
    return Math.max(
      ...messages.map(m => m.recvTimestamp ?? m.sentTimestamp ?? 0)
    );
  }, [messages]);

    // stable SSE handler
  const handleSSE = useCallback(
    (data) => {
      console.log('SSE Received SSE message:', data);
      if (data.type === 'message' && data.message) {
        appendMessage(data.message);

      }
    },
    [appendMessage]
  );


  // always register SSE hook in same order
  useSSE('message', handleSSE);

  const filteredMessages = selectedChannel
    ? messages.filter(m => m.channelId === selectedChannel)
    : messages;

  const isMeshtastic = filteredMessages.some(m => m.protocol === 'meshtastic');

  const handleSend = async ({ message }) => {
    try {
      const payload = {
        channelId: selectedChannel || (channels[0]?.channelId ?? 0),
        contactId: myInfo?.id,
        messageId: null,
        sender: myInfo?.id,
        mentions: JSON.stringify([]),
        message,
        protocol: isMeshtastic ? 'meshtastic' : 'meshcore',
        fromNodeNum: 0,
        toNodeNum: 0,
        options: JSON.stringify({}),
        sentTimestamp: Math.floor(Date.now() / 1000),
        recvTimestamp: Math.floor(Date.now() / 1000),
      };

      await fetch('/api/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom>
        Messages
      </Typography>

      <Tabs
        value={selectedChannel ?? false}
        onChange={(e, newValue) => setSelectedChannel(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        <Tab label="All" value={false} />
        {channels.map(ch => (
          <Tab
            key={ch.channelId || ch.channelNum}
            label={ch.name || `Channel ${ch.channelNum}`}
            value={ch.channelId}
          />
        ))}
      </Tabs>

      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error loading messages: {error.message}
        </Typography>
      )}

      {!loading && !error && (
        <>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {isMeshtastic
              ? <ThreadedMessageList messages={filteredMessages} threaded />
              : <MessageList messages={filteredMessages} />}
          </Box>

          <MessageComposer
            sender={myInfo?.name}
            onSend={handleSend}
          />
        </>
      )}
    </Box>
  );
}
