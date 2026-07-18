import { useState } from 'react';
import api from '../utils/api';

const OFFLINE_KEY = 'parkpay_offline_sessions';

export const useOffline = () => {
  const [syncing, setSyncing] = useState(false);

  const saveOfflineSession = (session) => {
    const existing = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
    existing.push({ ...session, savedAt: new Date().toISOString() });
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(existing));
  };

  const getOfflineSessions = () => {
    return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
  };

  const syncOfflineSessions = async () => {
    const sessions = getOfflineSessions();
    if (sessions.length === 0) return { synced: 0 };

    setSyncing(true);
    try {
      const res = await api.post('/sessions/sync', { sessions });
      localStorage.removeItem(OFFLINE_KEY);
      return { synced: sessions.length, results: res.data.results };
    } finally {
      setSyncing(false);
    }
  };

  const offlineCount = () => getOfflineSessions().length;

  return { saveOfflineSession, getOfflineSessions, syncOfflineSessions, syncing, offlineCount };
};
