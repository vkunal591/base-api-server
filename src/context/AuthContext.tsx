"use client";

import { Fetch } from "@/hooks/apiUtils";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { sendMail } from "@/app/lib/config/cron";

interface AuthContextProps {
  user: any;
  token: string | null;
  login: (token: string, userData: object) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const navigate = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<object | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    navigate.prefetch("/dashboard");
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async (sharedToken: string) => {
      const adminToken = localStorage.getItem("adminToken");
      const userDetails: any = localStorage.getItem("userData");
      setLoading(false);

      try {
        // const endpoint = "api/user/get-current-user";
        // const response: { success: boolean; data: any; message: string } =
        //   await Fetch(endpoint, {}, 5000, true, false);
        if (adminToken && userDetails) {
          const parsedUserDetails = JSON.parse(userDetails);
          console.log(parsedUserDetails);
          setToken(adminToken);
          setUser(parsedUserDetails);
          return navigate.replace(pathname);
        }
        const response: { success: boolean; data: any; message: string } = {
          success: true,
          data: JSON.parse(userDetails),
          message: "User found",
        };
        if (response?.success && response?.data) {
          setLoading(false);
          setToken(adminToken);
          setUser(response?.data);
          return navigate.replace("/dashboard");
        } else return navigate.replace("/auth/login");
      } catch (error) {
        setLoading(false);
        console.error(error);
        localStorage.clear();
        return navigate.replace("/auth/login");
      }
    };
    const sharedToken = localStorage.getItem("adminToken");
    if (sharedToken) fetchUser(sharedToken);
    else setLoading(false);
  }, [navigate]);

  const login = (token: string, userData: any) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem("adminToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    return navigate.push("/dashboard");
  };

  const logout = () => {
    setToken(null);
    setUser({});
    localStorage.clear();
    return navigate.replace("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
