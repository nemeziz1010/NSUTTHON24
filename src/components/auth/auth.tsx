import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';

// Define the type for the user
type UserType = { token: string } | null;

// Extend the type for the context to include the loading state
interface AuthContextType {
  user: UserType;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean; // Add loading state
}

// Update default values to include loading
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true, // Initially set to true, since we are determining the auth status
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true); // State to handle loading

  // When initializing, check if a JWT exists in local storage.
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setUser({ token });
    }
    setLoading(false); // Once we've checked, set loading to false
  }, []);

  const login = (token: string) => {
    localStorage.setItem('jwt', token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
