import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import * as Google from "expo-auth-session/providers/google";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId:
      "206093441022-9jlgkcqs9pv2v5okmq0kjhri5haph7at.apps.googleusercontent.com",
    expoClientId:
      "206093441022-kds721j9r6uq6avr2k3qsbvljuch8uje.apps.googleusercontent.com",
    clientId:
      "206093441022-unj0cu7klu4og7bjnq8n4d1u1eu98but.apps.googleusercontent.com",
  });

  useEffect(() => {
    setLoading(true)
    try {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential);
      }
    } catch (error) {
      setError(error);
    }setLoading(false)
  }, [response]);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
        setLoadingInitial(false);
      }),
    []
  );

  const memoedValue = useMemo(
    () => ({
      loading,
      user,
      error,
      promptAsync,
      logout,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};
export default function useAuth() {
  return useContext(AuthContext);
}
