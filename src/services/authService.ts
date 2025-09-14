import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  favorites: number[];
  gameHistory: number[];
}

export interface AuthError {
  code: string;
  message: string;
}

class AuthService {
  // Authentication methods
  async register(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await this.createUserProfile(user, { displayName });
      
      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await this.createUserProfile(user);
      }
      
      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // User profile methods
  async createUserProfile(user: User, additionalData?: any) {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: additionalData?.displayName || user.displayName || 'Anonymous',
        photoURL: user.photoURL || undefined,
        createdAt: new Date(),
        favorites: [],
        gameHistory: []
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      return userProfile;
    } catch (error: any) {
      throw new Error('Failed to create user profile: ' + error.message);
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error: any) {
      throw new Error('Failed to get user profile: ' + error.message);
    }
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
    try {
      await updateDoc(doc(db, 'users', uid), updates);
    } catch (error: any) {
      throw new Error('Failed to update user profile: ' + error.message);
    }
  }

  // Favorites methods
  async addToFavorites(uid: string, gameId: number) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        favorites: arrayUnion(gameId)
      });
    } catch (error: any) {
      throw new Error('Failed to add to favorites: ' + error.message);
    }
  }

  async removeFromFavorites(uid: string, gameId: number) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        favorites: arrayRemove(gameId)
      });
    } catch (error: any) {
      throw new Error('Failed to remove from favorites: ' + error.message);
    }
  }

  async addToGameHistory(uid: string, gameId: number) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        gameHistory: arrayUnion(gameId)
      });
    } catch (error: any) {
      throw new Error('Failed to add to game history: ' + error.message);
    }
  }

  // Auth state observer
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  // Error handling
  private handleAuthError(error: any): AuthError {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No user found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
      'auth/popup-blocked': 'Sign-in popup was blocked by the browser.',
    };

    return {
      code: error.code || 'unknown-error',
      message: errorMessages[error.code] || error.message || 'An unexpected error occurred.'
    };
  }
}

export default new AuthService();