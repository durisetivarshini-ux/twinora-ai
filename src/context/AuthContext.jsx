import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('twinora_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [merchant, setMerchant] = useState(() => {
    try {
      const stored = localStorage.getItem('twinora_merchant');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Synchronize profile & business records from Supabase (or fallback API)
  const syncSupabaseProfile = async (authUserId, userEmail) => {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      // Fetch user profile from Supabase 'profiles' table
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .single();

      // Fetch business profile from Supabase 'businesses' table
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', authUserId)
        .limit(1)
        .single();

      if (profileData && !profileErr) {
        const mappedUser = {
          id: profileData.id,
          fullName: profileData.full_name || userEmail?.split('@')[0] || 'Store Operator',
          email: profileData.email || userEmail,
          role: profileData.role || 'Store Owner',
          phone: profileData.phone || '',
          location: profileData.location || 'San Francisco, CA',
          timezone: profileData.timezone || 'America/Los_Angeles',
          avatarUrl: profileData.avatar_url || ''
        };
        setUser(mappedUser);
        localStorage.setItem('twinora_user', JSON.stringify(mappedUser));

        if (businessData) {
          const mappedMerchant = {
            id: businessData.id,
            userId: authUserId,
            businessName: businessData.name || 'NovaCart Electronics',
            businessCategory: businessData.category || 'D2C Retail & Electronics',
            currency: businessData.currency || '₹',
            targetMonthlyRevenue: businessData.target_monthly_revenue || 1050000,
            location: businessData.location || 'San Francisco, CA',
            timezone: businessData.timezone || 'America/Los_Angeles'
          };
          setMerchant(mappedMerchant);
          localStorage.setItem('twinora_merchant', JSON.stringify(mappedMerchant));
        }
        return mappedUser;
      }
    } catch (err) {
      console.warn('[AuthContext] Supabase profile query error:', err.message);
    }
    return null;
  };

  // 1. Initial Session Load & Realtime Auth Listener
  useEffect(() => {
    let subscription = null;

    const initAuth = async () => {
      setLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await syncSupabaseProfile(session.user.id, session.user.email);
          }

          // Listen for Supabase auth events (login, logout, token refresh)
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              await syncSupabaseProfile(session.user.id, session.user.email);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setMerchant(null);
              localStorage.removeItem('twinora_user');
              localStorage.removeItem('twinora_merchant');
              localStorage.removeItem('twinora_token');
            }
          });
          subscription = authListener?.subscription;
        } else {
          // Fallback to Express backend token check if Supabase is not configured
          const token = localStorage.getItem('twinora_token');
          if (token) {
            const [pData, mData] = await Promise.all([
              apiService.getProfile().catch(() => null),
              apiService.getMerchantProfile().catch(() => null)
            ]);
            if (pData && !pData.error) {
              setUser(pData);
              localStorage.setItem('twinora_user', JSON.stringify(pData));
            }
            if (mData && !mData.error) {
              setMerchant(mData);
              localStorage.setItem('twinora_merchant', JSON.stringify(mData));
            }
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Auth initialization error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // 2. User Sign-In
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (error) throw error;
        if (data.user) {
          await syncSupabaseProfile(data.user.id, data.user.email);
          return data.user;
        }
      }

      // Backend fallback login
      const res = await apiService.login(email, password);
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
        return res.user;
      } else if (res.error) {
        throw new Error(res.error);
      }
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. User Sign-Up
  const signup = async (fullName, businessName, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              business_name: businessName.trim()
            }
          }
        });
        if (error) throw error;

        if (data.user) {
          // Insert profile into 'profiles' table
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email.trim(),
            full_name: fullName.trim(),
            role: 'Store Owner'
          });

          // Insert business into 'businesses' table
          const { data: bData } = await supabase.from('businesses').insert({
            owner_id: data.user.id,
            name: businessName.trim(),
            category: 'Retail & E-commerce',
            currency: '₹',
            target_monthly_revenue: 1050000
          }).select().single();

          const mappedUser = {
            id: data.user.id,
            fullName: fullName.trim(),
            email: email.trim(),
            role: 'Store Owner'
          };
          setUser(mappedUser);
          localStorage.setItem('twinora_user', JSON.stringify(mappedUser));

          if (bData) {
            const mappedMerchant = {
              id: bData.id,
              userId: data.user.id,
              businessName: bData.name,
              currency: '₹',
              targetMonthlyRevenue: 1050000
            };
            setMerchant(mappedMerchant);
            localStorage.setItem('twinora_merchant', JSON.stringify(mappedMerchant));
          }

          return { user: mappedUser };
        }
      }

      // Backend fallback signup
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
      } else if (res.error) {
        throw new Error(res.error);
      }
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 4. Sign-Out
  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch {}

    apiService.logout();
    localStorage.removeItem('twinora_token');
    localStorage.removeItem('twinora_user');
    localStorage.removeItem('twinora_merchant');
    setUser(null);
    setMerchant(null);
  };

  // 5. Update Profile & Business
  const updateProfile = async (formData) => {
    try {
      if (isSupabaseConfigured && supabase && user?.id) {
        // Update Supabase 'profiles' table
        await supabase.from('profiles').update({
          full_name: formData.fullName,
          phone: formData.phone,
          role: formData.role,
          location: formData.location,
          timezone: formData.timezone
        }).eq('id', user.id);

        // Update Supabase 'businesses' table if changed
        if (formData.businessName || formData.businessCategory) {
          await supabase.from('businesses').update({
            name: formData.businessName,
            category: formData.businessCategory
          }).eq('owner_id', user.id);
        }
      }

      // Also sync to backend API if applicable
      const updated = await apiService.updateProfile(formData);
      
      const newMergedUser = {
        ...(user || {}),
        fullName: formData.fullName || user?.fullName,
        role: formData.role || user?.role,
        phone: formData.phone || user?.phone,
        location: formData.location || user?.location,
        timezone: formData.timezone || user?.timezone
      };
      setUser(newMergedUser);
      localStorage.setItem('twinora_user', JSON.stringify(newMergedUser));

      if (formData.businessName || formData.businessCategory) {
        const newMergedMerchant = {
          ...(merchant || {}),
          businessName: formData.businessName || merchant?.businessName,
          businessCategory: formData.businessCategory || merchant?.businessCategory
        };
        setMerchant(newMergedMerchant);
        localStorage.setItem('twinora_merchant', JSON.stringify(newMergedMerchant));
      }

      return newMergedUser;
    } catch (err) {
      console.warn('[AuthContext] Update profile error:', err.message);
      throw err;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await syncSupabaseProfile(user.id, user.email);
    }
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
      loading,
      authError,
      isSupabaseConnected: isSupabaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
