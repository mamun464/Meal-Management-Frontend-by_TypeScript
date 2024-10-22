import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../../core/hooks/useLocalStorage";
import { useLogin, LoginResponse } from "../hooks/useLogin";
import { useLogout } from "../hooks/useLogout";
import { useUserInfo } from "../hooks/useUserInfo";
import { UserInfo } from "../types/userInfo";

interface AuthContextInterface {
  hasRole: (roles?: string[]) => {};
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (phone: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  userInfo?: UserInfo;
}

export const AuthContext = createContext({} as AuthContextInterface);

type AuthProviderProps = {
  children?: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authKey, setAuthKey] = useLocalStorage<string>("authkey", "");

  const { isLoggingIn, login } = useLogin();
  const { isLoggingOut, logout } = useLogout();
  const { data: userInfo } = useUserInfo(authKey);

  // const hasRole = (roles?: string[]) => {
  //   if (!roles || roles.length === 0) {
  //     return true;
  //   }
  //   if (!userInfo) {
  //     return false;
  //   }
  //   return roles.includes(userInfo.role);
  // };
  const hasRole = (roles?: string[]) => {
    if (!roles || roles.length === 0) {
      return true; // No specific role required, allow access
    }
    if (!userInfo) {
      return false; // If user info is not available, deny access
    }

    // Determine the role based on userInfo flags
    const userRole = userInfo.is_superuser
      ? "Admin"
      : userInfo.is_manager
        ? "Manager"
        : "Member"; // Default to "Member" if neither flag is true

    // Check if the user's role is in the list of allowed roles
    return roles.includes(userRole);
  };


  const handleLogin = async (phone: string, password: string) => {
    return login({ phone, password })
      .then((data: LoginResponse) => {
        if (data.success) {
          setAuthKey(data.token.access); // Set the access token
          console.log("Login successful:", data); // Log the entire data object
          return data.token.access; // Return the modified data object
        } else {
          throw new Error(data.message); // Handle unsuccessful login
        }
      })
      .catch((err) => {
        console.error("Login failed:", err); // Handle errors
        throw err;
      });
  };
  // const handleLogin = async (email: string, password: string) => {
  //   return login({ email, password })
  //     .then((key: string) => {
  //       setAuthKey(key);
  //       return key;
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // };

  const handleLogout = async () => {
    return logout()
      .then((data) => {
        setAuthKey("");
        return data;
      })
      .catch((err) => {
        throw err;
      });
  };

  return (
    <AuthContext.Provider
      value={{
        hasRole,
        isLoggingIn,
        isLoggingOut,
        login: handleLogin,
        logout: handleLogout,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
