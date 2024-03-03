"use client";

import { checkSession, doLogout } from "@/actions/session";
import { ignore } from "@/middleware";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SessionContextValue = {
  user: Omit<User, "password"> | null;
  status: Status;
  error: Error | null;
  isLoading: boolean;
  logout: () => Promise<void>;
};

enum Status {
  AUTHORIZED = "authorized",
  UNAUTHORIZED = "unauthorized",
}

export const SessionContext = createContext<SessionContextValue>(
  {} as SessionContextValue
);

export const SessionProvider = (props: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [error, setError] = useState<SessionContextValue["error"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(Status.UNAUTHORIZED);
  const [user, setUser] = useState<SessionContextValue["user"]>(null);

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      const res = await checkSession();
      if (res.authenticated) {
        setStatus(Status.AUTHORIZED);
        setUser(res.user);
      } else {
        setStatus(Status.UNAUTHORIZED);
        setUser(null);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error("unknown"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!ignore.includes(pathname)) {
      checkAuth();
    }
  }, [pathname]);

  const logout = async () => {
    await doLogout();
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isLoading,
      logout,
    }),
    [user, status, error, isLoading]
  );

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error(
      "[auth]: `useSession` must be wrapped in a <SessionProvider />"
    );
  }

  return value;
};
