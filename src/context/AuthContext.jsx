import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('twinora_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [merchant, setMerchant] = useState(() => {
    try {
      const stored = localStorage.getItem('twinora_merchant');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('twinora_token');
      if (token) {
        const [profileData, merchantData] = await Promise.all([
          apiService.getProfile().catch(() => null),
          apiService.getMerchantProfile().catch(() => null)
        ]);
        if (profileData && !profileData.error) {
          setUser(profileData);
          localStorage.setItem('twinora_user', JSON.stringify(profileData));
        }
        if (merchantData && !merchantData.error) {
          setMerchant(merchantData);
          localStorage.setItem('twinora_merchant', JSON.stringify(merchantData));
        }
      }
    } catch (error) {
      console.warn('AuthContext background sync:', error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiService.login(email, password);
      if (res.token) {
        localStorage.setItem('twinora_token', res.token);
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('twinora_user', JSON.stringify(res.user));
        }
        // Background fetch fresh merchant data
        apiService.getMerchantProfile().then(m => {
          if (m && !m.error) {
            setMerchant(m);
            localStorage.setItem('twinora_merchant', JSON.stringify(m));
          }
        }).catch(() => {});
        return res.user;
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, businessName, email, password) => {
    setLoading(true);
    try {
      const res = await apiService.signup(fullName, businessName, email, password);
      if (res.token) {
        localStorage.setItem('twinora_token', res.token);
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('twinora_user', JSON.stringify(res.user));
        }
        if (res.merchant) {
          setMerchant(res.merchant);
          localStorage.setItem('twinora_merchant', JSON.stringify(res.merchant));
        }
        return res;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    localStorage.removeItem('twinora_token');
    localStorage.removeItem('twinora_user');
    localStorage.removeItem('twinora_merchant');
    setUser(null);
    setMerchant(null);
  };

  const updateProfile = async (formData) => {
    const updated = await apiService.updateProfile(formData);
    if (updated) {
      setUser(updated);
      localStorage.setItem('twinora_user', JSON.stringify(updated));
    }
    if (formData.businessName || formData.businessCategory) {
      const updatedMerchant = await apiService.getMerchantProfile();
      if (updatedMerchant && !updatedMerchant.error) {
        setMerchant(updatedMerchant);
        localStorage.setItem('twinora_merchant', JSON.stringify(updatedMerchant));
      }
    }
    return updated;
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      merchant, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      refreshProfile, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
