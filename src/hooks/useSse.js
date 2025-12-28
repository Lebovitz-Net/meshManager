// src/hooks/useSse.js
import { useEffect, useRef } from 'react';

const handlers = new Map();
let source = null;

function initSSE() {
  if (source) return;

  source = new EventSource(`/events`);

  source.onmessage = (event) => {
    let parsed;
    try {
      parsed = JSON.parse(event.data);
    } catch (err) {
      console.warn('[SSE] Non‑JSON event:', event.data);
      return;
    }

    const { type } = parsed;
    console.log('[SSE] Event received:', parsed);

    const typeHandlers = handlers.get(type);
    if (typeHandlers) {
      typeHandlers.forEach((cb) => {
        try {
          cb(parsed);
        } catch (err) {
          console.error('[SSE] Handler error:', err);
        }
      });
    }
  };

  source.onerror = (err) => {
    console.error('[SSE] Connection error:', err);
    source.close();
    source = null;
    setTimeout(initSSE, 3000);
  };
}

function registerHandler(type, callback) {
  if (!handlers.has(type)) {
    handlers.set(type, new Set());
  }
  handlers.get(type).add(callback);
}

function unregisterHandler(type, callback) {
  console.log("Registering SSE handler:", callback);
  if (handlers.has(type)) {
    handlers.get(type).delete(callback);
    if (handlers.get(type).size === 0) {
      handlers.delete(type);
    }
  }
}

export default function useSSE(type, callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    initSSE();

    const stableHandler = (data) => callbackRef.current(data);

    console.log("MessagesTab mounted");
    registerHandler(type, stableHandler);
    return () => {
      console.log("MessagesTab unmounted");
      unregisterHandler(type, stableHandler);
    }
  }, [type]);
}


// 👉 Convenience wrapper for contacts
export function useContactsSSE(callback) {
  return useSSE('contact', callback);
}
