// File: src/api/useMyInfo.js

import { useEffect, useState } from 'react';

/**
 * Hook to fetch managed nodes from /api/v1/myinfo.
 * Returns { nodes, myInfo, loading, error } for UI consumption.
 *
 * - nodes: array of all managed nodes
 * - myInfo: canonical sender record { id, name }
 */
export function useMyInfo() {
  const [nodes, setNodes] = useState([]);
  const [myInfo, setMyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMyInfo() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/v1/myinfo');
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();

        setNodes(data);

        // Pick the primary node (first or flagged as "self")
        if (Array.isArray(data) && data.length > 0) {
          const primary = data[0];
          console.log('.../MYINFO ', primary)
          setMyInfo({
            id: primary.id || primary.name,
            nodeNum: primary.nodeNum,
            name: primary.name || primary.shortName || 'Unknown'
          });
        }
      } catch (err) {
        console.error('[meshBridge] fetchMyInfo error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyInfo();
  }, []);

  return { nodes, myInfo, loading, error };
}
