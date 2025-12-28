// File: src/hooks/useContacts.js
import { useEffect, useState } from 'react';

/**
 * Custom hook to fetch all contacts (users) from meshBridgeServer.
 *
 * @returns {{ contacts: Array, loading: boolean, error: Error|null }}
 */
export default function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchContacts() {
      setLoading(true);
      setError(null);

      try {
        const url = `/api/v1/contacts`; // ✅ unified endpoint
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch contacts: ${response.status} ${errorText}`
          );
        }

        const data = await response.json();

        // Normalize to array
        const normalized = Array.isArray(data) ? data : [];
        setContacts(normalized);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[meshBridge] fetchContacts error:', err);
          setError(err);
          setContacts([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();

    return () => controller.abort();
  }, []);

  return { contacts, loading, error };
}
