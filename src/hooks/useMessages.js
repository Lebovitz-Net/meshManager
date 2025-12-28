// File: src/hooks/useMessages.js
import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook to fetch and merge messages from meshBridgeServer.
 *
 * @param {Object} options
 * @param {number|null} options.channelId - optional channel filter
 * @param {number} options.sinceDate - cutoff timestamp for incremental fetch
 * @param {number} options.limit - max number of messages to fetch
 *
 * @returns {{ messages: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export default function useMessages({ channelId = null, sinceDate = 0, limit = 500 } = {}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // helper: merge new messages into existing state
  const mergeMessages = useCallback((prev, incoming) => {
    const merged = [...prev];
    incoming.forEach(msg => {
      const idx = merged.findIndex(m => m.messageId === msg.messageId);
      if (idx === -1) {
        merged.push(msg);
      } else {
        merged[idx] = { ...merged[idx], ...msg };
      }
    });
    // sort newest first by recvTimestamp
    return merged.sort((a, b) => (b.recvTimestamp ?? 0) - (a.recvTimestamp ?? 0));
  }, []);

  const appendMessage = useCallback((msg) => {
    setMessages(prev => {
      const next = mergeMessages(prev, [msg]);
      return next;
    });
  }, [mergeMessages]);

  const fetchMessages = useCallback(
    async ({ channelId: cid = channelId, sinceDate: sd = sinceDate, limit: l = limit } = {}) => {
      setLoading(true);
      setError(null);

      const controller = new AbortController();

      try {
        const params = new URLSearchParams();
        if (cid !== null) params.append('channelId', cid);
        if (sd > 0) params.append('sinceDate', sd);
        if (l) params.append('limit', l);

        const url = `/api/v1/messages?${params.toString()}`;
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch messages: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const normalized = Array.isArray(data) ? data : [];

        setMessages(prev => mergeMessages(prev, normalized));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[meshBridge] fetchMessages error:', err);
          setError(err);
        }
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    },
    [channelId, sinceDate, limit, mergeMessages]
  );

  // initial load: fetch all messages
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages, appendMessage };


}


