import { createContext, useEffect, useState } from "react";
import { getToken, setToken, removeToken } from "../utils/token";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // 🔹 Al cargar la app, revisamos si hay token
  useEffect(() => {
    const token = getToken();

    if (!token) {
      resetAuth();
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      setIsLoggedIn(true);
      setUser({
        id: payload.id,
      });
      setRole(payload.role);
    } catch {
      resetAuth();
    }
  }, []);

  const login = (token) => {
    setToken(token);

    const payload = JSON.parse(atob(token.split(".")[1]));

    setIsLoggedIn(true);
    setUser({
      id: payload.id,
    });
    setRole(payload.role);
  };

  const logout = () => {
    resetAuth();
  };

  const resetAuth = () => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// 👉 ESTA LÍNEA FALTABA
export default AppContext;
