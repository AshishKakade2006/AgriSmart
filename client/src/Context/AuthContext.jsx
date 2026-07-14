import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    setUser(JSON.parse(user));
  }
}, []);

  const login = (token, userData) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));

  setUser(userData);
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);