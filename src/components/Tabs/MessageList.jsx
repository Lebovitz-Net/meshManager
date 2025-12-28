import MessageCard from './MessageCard.jsx';

export default function MessageList({ messages }) {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        overflowY: 'auto',
        height: '100%',
        paddingRight: '0.5rem',
      }}
    >
      {messages.map(m => (
        <MessageCard
          key={m.id || m.messageId}
          message={{
            id: m.id,
            contactId: m.contactId,
            channelId: m.channelId,
            sender: m.sender,
            fromNodeNum: m.fromNodeNum,
            toNodeNum: m.toNodeNum,
            toNodeType: m.toNodeType,
            messageId: m.messageId,
            message: m.message,
            mentions: m.mentions,
            options: m.options,
            sentTimestamp: m.sentTimestamp,
            recvTimestamp: m.recvTimestamp,
            protocol: m.protocol,
            connId: m.connId
          }}
        />
      ))}
    </div>
  );
}
