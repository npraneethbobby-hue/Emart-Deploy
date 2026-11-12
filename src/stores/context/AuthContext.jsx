
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";

import { auth } from "../../firebase";

const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Create account using email and password
  const signup = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(result.user, {
      displayName: name,
    });

    return result.user;
  };

  // Login using email and password
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return result.user;
  };

  // Login using Google
  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // Set an E-Mart password for a Google account
  const setPassword = async (password) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Please log in first.");
    }

    if (!currentUser.email) {
      throw new Error("Your account does not have an email address.");
    }

    const alreadyHasPassword = currentUser.providerData.some(
      (provider) => provider.providerId === "password"
    );

    if (alreadyHasPassword) {
      throw new Error("Your account already has a password.");
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );

    const result = await linkWithCredential(
      currentUser,
      credential
    );

    setUser(result.user);

    return result.user;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    googleLogin,
    setPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
