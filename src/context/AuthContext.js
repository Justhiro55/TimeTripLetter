import { createContext, useContext, useState } from 'react';

// AuthContextを作成
const AuthContext = createContext();

// AuthProviderを作成
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// AuthContextを使用するためのカスタムフック
export function useAuth() {
  return useContext(AuthContext);
}