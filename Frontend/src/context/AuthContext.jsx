import { createContext, useState, useEffect } from "react";
import storage from "../utils/storage";
import { ROLES } from "../constant/role";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());

  useEffect(() => {
    if (user) storage.setUser(user);
    else storage.clearUser();
  }, [user]);

  const login = (role) => {
    const newUser = { name: "Demo User", role };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    storage.clearUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
