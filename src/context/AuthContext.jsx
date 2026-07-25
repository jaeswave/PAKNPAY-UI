import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [attendant, setAttendant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('parkpay_token');
    const saved = localStorage.getItem('parkpay_attendant');
    if (token && saved) {
      setAttendant(JSON.parse(saved));
      refreshMe();
    }
    setLoading(false);
  }, []);

  const refreshMe = async () => {
    try {
      const res = await api.get('/attendants/me');
      const fresh = {
        id: res.data.attendant._id,
        name: res.data.attendant.name,
        phone: res.data.attendant.phone,
        role: res.data.attendant.role,
        lotId: res.data.attendant.lotId?._id,
        hasDashboardPin: !!res.data.attendant.dashboardPin,
        lotApprovalStatus: res.data.attendant.lotApprovalStatus,
      };
      localStorage.setItem('parkpay_attendant', JSON.stringify(fresh));
      setAttendant(fresh);
    } catch {
      logout();
    }
  };

  const login = async (phone, pin) => {
    const res = await api.post('/attendants/login', { phone, pin });
    localStorage.setItem('parkpay_token', res.data.token);
    localStorage.setItem('parkpay_attendant', JSON.stringify(res.data.attendant));
    setAttendant(res.data.attendant);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('parkpay_token');
    localStorage.removeItem('parkpay_attendant');
    sessionStorage.removeItem('parkpay_owner_unlocked');
    setAttendant(null);
  };

  return (
    <AuthContext.Provider value={{ attendant, login, logout, loading, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);