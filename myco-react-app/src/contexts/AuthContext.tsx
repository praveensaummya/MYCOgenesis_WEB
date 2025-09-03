'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  role: 'user' | 'editor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  profile?: {
    displayName?: string;
    photoURL?: string;
    bio?: string;
    preferences?: object;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
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
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Firebase is configured, proceed with normal functionality

  // Create or update user profile in Firestore
  const createUserProfile = useCallback(async (user: User): Promise<UserProfile> => {
    if (!firebaseReady || !db) {
      throw new Error('Firebase not configured');
    }
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user profile
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        role: 'user',
        status: 'active',
        profile: {
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      // Update existing profile with latest auth data
      const existingProfile = userSnap.data() as UserProfile;
      const updatedProfile = {
        ...existingProfile,
        profile: {
          ...existingProfile.profile,
          displayName: user.displayName || existingProfile.profile?.displayName || '',
          photoURL: user.photoURL || existingProfile.profile?.photoURL || '',
        },
        updatedAt: new Date(),
      };

      await setDoc(userRef, updatedProfile, { merge: true });
      return updatedProfile;
    }
  }, [firebaseReady]);

  // Login with email and password
  const login = async (email: string, password: string): Promise<void> => {
    if (!firebaseReady || !auth) {
      throw new Error('Firebase not configured');
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup with email and password
  const signup = async (email: string, password: string, displayName: string): Promise<void> => {
    if (!firebaseReady || !auth) {
      throw new Error('Firebase not configured');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    if (!firebaseReady || !auth) {
      throw new Error('Firebase not configured');
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    if (!firebaseReady || !auth) {
      throw new Error('Firebase not configured');
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    if (!firebaseReady || !db) {
      throw new Error('Firebase not configured');
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updatedProfile = {
        ...updates,
        updatedAt: new Date(),
      };

      await setDoc(userRef, updatedProfile, { merge: true });
      setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Check Firebase configuration and set up auth listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      console.warn('Firebase is not configured. Authentication features will be disabled.');
      setFirebaseReady(false);
      setLoading(false);
      return;
    }

    setFirebaseReady(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await createUserProfile(user);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [createUserProfile]);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};