import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import authService, { UserProfile, AuthError } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, displayName: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  addToFavorites: (gameId: number) => Promise<void>;
  removeFromFavorites: (gameId: number) => Promise<void>;
  isFavorite: (gameId: number) => boolean;
  addToGameHistory: (gameId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<User> => {
    const user = await authService.login(email, password);
    return user;
  };

  const register = async (email: string, password: string, displayName: string): Promise<User> => {
    const user = await authService.register(email, password, displayName);
    return user;
  };

  const loginWithGoogle = async (): Promise<User> => {
    const user = await authService.loginWithGoogle();
    return user;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUserProfile(null);
  };

  const resetPassword = async (email: string): Promise<void> => {
    await authService.resetPassword(email);
  };

  const addToFavorites = async (gameId: number): Promise<void> => {
    if (!currentUser) throw new Error('User not authenticated');
    await authService.addToFavorites(currentUser.uid, gameId);
    // Update local state
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        favorites: [...userProfile.favorites, gameId]
      });
    }
  };

  const removeFromFavorites = async (gameId: number): Promise<void> => {
    if (!currentUser) throw new Error('User not authenticated');
    await authService.removeFromFavorites(currentUser.uid, gameId);
    // Update local state
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        favorites: userProfile.favorites.filter(id => id !== gameId)
      });
    }
  };

  const isFavorite = (gameId: number): boolean => {
    return userProfile?.favorites.includes(gameId) || false;
  };

  const addToGameHistory = async (gameId: number): Promise<void> => {
    if (!currentUser) return;
    await authService.addToGameHistory(currentUser.uid, gameId);
    // Update local state
    if (userProfile && !userProfile.gameHistory.includes(gameId)) {
      setUserProfile({
        ...userProfile,
        gameHistory: [...userProfile.gameHistory, gameId]
      });
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Load user profile
        try {
          const profile = await authService.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToGameHistory
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;