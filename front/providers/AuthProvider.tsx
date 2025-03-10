"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

export const authContext = createContext<{
  user: any;
  setUser: (user: any) => void;
}>({ user: null, setUser: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const user = localStorage.getItem("user");

    setUser(user ? JSON.parse(user) : null);
  }, []);

  return (
    <authContext.Provider value={{ user, setUser }}>
      {children}
    </authContext.Provider>
  );
};
