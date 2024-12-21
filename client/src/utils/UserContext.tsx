import { createClient, Session } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";
import { User } from "./types";
import { queryClient } from "@/_Root";
import getUser from "./getUser";

interface IUserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  supabaseSession: Session | null;
}
export const UserContext = createContext<IUserContext>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
  supabaseSession: null,
});

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSupabaseSession(session);

      if (event == "SIGNED_IN") {
        queryClient.ensureQueryData({
          queryKey: ["user"],
          queryFn: getUser,
        });
      }

      if (event == "SIGNED_OUT") {
        setUser(null);
        queryClient.removeQueries({ queryKey: ["user"] });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    setUser,
    supabaseSession,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
