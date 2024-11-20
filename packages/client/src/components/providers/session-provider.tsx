/* eslint-disable react-refresh/only-export-components */
import axiosIntance from "@/api/axiosInstance";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

interface AuthUser {
  id: string;
  email: string;
}

interface ISessionContext {
  authUser: AuthUser | null;
  signin(provider: string, formData: any): Promise<void>;
  signup(provider: string, formData: any): Promise<void>;
  signout(): Promise<void>;
}

const SessionContext = createContext<ISessionContext | null>(null);

export const useSession = () => {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return sessionContext;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await axiosIntance.get("/api/auth/authuser");
        setAuthUser(data.authUser);
      } catch {
        setAuthUser(null);
      }
    };

    getSession();
  }, []);

  useLayoutEffect(() => {
    const responseInterceptor = axiosIntance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (err) => {
        const originalConfig = err.config;

        if (err.response?.status === 403 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            await axiosIntance.post("/api/auth/refresh");

            return axiosIntance(originalConfig);
          } catch {
            setAuthUser(null);
          }
        }

        if (err.response?.status === 401) {
          setAuthUser(null);
        }

        return Promise.reject(err);
      }
    );

    return () => {
      axiosIntance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const signin = async (provider: string, formData: any) => {
    const { data } = await axiosIntance.post("/api/auth/signin", {
      provider,
      ...formData,
    });

    setAuthUser(data as AuthUser);
  };

  const signup = async (provider: string, formData: any) => {
    const { data } = await axiosIntance.post("/api/auth/signup", {
      provider,
      ...formData,
    });

    setAuthUser(data as AuthUser);
  };

  const signout = async () => {
    try {
      await axiosIntance.post("/api/auth/signout");
    } catch {
      /* empty */
    }
    setAuthUser(null);
  };

  return (
    <SessionContext.Provider value={{ authUser, signin, signup, signout }}>
      {children}
    </SessionContext.Provider>
  );
};
