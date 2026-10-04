import { createContext, useContext, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'staynest_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const saveUser = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    saveUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const toggleWishlist = async (listingId) => {
    if (!user) return false;
    const { data } = await api.post(`/auth/wishlist/${listingId}`);
    const updatedUser = { ...user, wishlist: data.wishlist };
    saveUser(updatedUser);
    return data.wishlisted;
  };

  const isWishlisted = (listingId) => {
    return Boolean(user?.wishlist?.some((id) => (id._id || id) === listingId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        toggleWishlist,
        isWishlisted,
        isHost: user?.role === 'host',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
