// File: src/components/Tabs/ContactsTab.jsx

import { useMemo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import ContactsCard from './ContactsCard.jsx';
import useContacts from '@/hooks/useContacts.js';
import { useContactsSSE } from '@/hooks/useSse.js';

export default function ContactsTab() {
  // unified hook: fetches contacts, supports refetch with sinceDate
  const { contacts, loading, error, refetch } = useContacts({ sinceDate: 0 });

  // compute lastSeenTimestamp from current contacts
  const lastSeenTimestamp = useMemo(() => {
    if (!contacts || contacts.length === 0) return 0;
    return Math.max(...contacts.map(c => c.recvTimestamp ?? 0));
  }, [contacts]);

  // SSE subscription: signal only
  useContactsSSE(() => {
    console.log('[ContactsTab] SSE signal: contact update');
    refetch({ sinceDate: lastSeenTimestamp });
  });

  return (
    <Box sx={{ p: 2, overflowY: 'auto', height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Contacts
      </Typography>

      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error loading contacts: {error.message}
        </Typography>
      )}

      {!loading && !error && contacts.map(contact => (
        <ContactsCard key={contact.contactId} contact={contact} />
      ))}
    </Box>
  );
}
