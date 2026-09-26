import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(apiBase + "/api/auth/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          setIsLoggedIn(false);
          return;
        }

        const data = await res.json();
        setUser(data.user);
        setIsLoggedIn(true);
        console.log("user data from context : ", data.user)
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);  
      }
    };

    fetchUserData(); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}