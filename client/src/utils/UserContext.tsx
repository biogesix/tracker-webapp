import { createClient, Session } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";
import User from "../types/User";

interface IUserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  supabaseSession: Session | null;
}
export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
  supabaseSession: null,
});

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY!
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseSession(session);

      // console.log(ev);
      if (event == "SIGNED_IN") {
        const userEmail = session!.user.email!;
        fetch(`http://localhost:3000/user?email=${userEmail}`).then(
          async (res) => setUser(await res.json())
        );
      }

      if (event == "SIGNED_OUT") {
        setUser(null);
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
