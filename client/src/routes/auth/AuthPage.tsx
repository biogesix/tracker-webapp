import { FormEvent, useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { supabase, UserContext } from "../../utils/UserContext";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
// import { ToastAction } from "@/components/ui/toast"

const AuthPage = () => {
  const { supabaseSession } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    if (supabaseSession) {
      nav("/dashboard");
    }
    setLoading(false);
  }, [nav, supabaseSession]);
  const { toast } = useToast();

  const [change, setChange] = useState("LOG IN");
  const { setUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    try {
      if (change === "LOG IN") {
        if (email === "" || password === "") {
          throw new Error("Empty email or password");
        }
        console.log(change);
      } else {
        if (email === "" || password === "" || username === "")
          throw new Error("Empty input fields");
      }

      if (change === "SIGN UP") {
        register();
      } else {
        logIn();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      console.log("ERROR FETCH: ", error.message);
    }
  };

  const logIn = async () => {
    console.log("EMAIL: " + email);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      throw new Error("Error signing in: " + error.message);
    }

    // get user from database
    const fetchedUser = await fetch(
      `http://localhost:3000/user?email=${email}`
    );

    if (fetchedUser.status === 200) {
      const { data } = await fetchedUser.json();
      setUser(data);
      nav("/dashboard");

      return;
    }
    // if it does not exist then create a new user

    const { data } = await createUser();

    setUser(data);
    nav("/dashboard");

    // add user to context
  };

  const register = async () => {
    if (username === "") {
      throw new Error("Empty username");
    }

    // const fetchedUser = await fetch(
    //   `http://localhost:3000/user?email=${email}`
    // );

    // if (fetchedUser.status === 200) {
    //   throw new Error("User already exists");
    // }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      throw new Error("Error signing up: " + error.message);
    }

    await createUser();
    toast({
      title: "Congratulations!",
      description: "Your account has been registered",
    });
    console.log("registered!");
    setChange("LOG IN");
  };

  const createUser = async () => {
    return await fetch(`http://localhost:3000/user`, {
      method: "POST",
      body: JSON.stringify({ username, email }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-t from-[#4C9182] to-[#D9DBBC]">
      {loading ? (
        <>
          <div>
            <div className="justify-center rounded-3xl bg-white/50 px-10 py-10 shadow-md">
              <p className="text-[40px] font-bold text-[#292421]">Loading...</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-4/4 flex flex-col items-center justify-center rounded-3xl bg-white/50 py-10 shadow-md">
            <p className="text-[40px] font-bold text-[#292421]">{change}</p>
            <div className="flex">
              <button
                className={
                  change === "SIGN UP"
                    ? "mx- h-[50px] w-[151px] rounded-l-full bg-[#F1E7DD] p-[10px] text-[#292421] hover:bg-[#e4e4e4]"
                    : "mx- h-[50px] w-[151px] rounded-l-full bg-[#2F4F4F] p-[10px] hover:bg-[#7A9590]"
                }
                onClick={() => {
                  setChange("LOG IN");
                }}
              >
                LOG IN
              </button>
              <button
                className={
                  change === "LOG IN"
                    ? "mx- h-[50px] w-[151px] rounded-r-full bg-[#F1E7DD] p-[10px] text-[#292421] hover:bg-[#e4e4e4]"
                    : "mx- h-[50px] w-[151px] rounded-r-full bg-[#2F4F4F] p-[10px] hover:bg-[#7A9590]"
                }
                onClick={() => {
                  setChange("SIGN UP");
                }}
              >
                SIGN UP
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="inputs flex flex-col items-center px-20 py-10"
            >
              <div className="username relative">
                {change === "SIGN UP" && (
                  <>
                    <input
                      className="placeholder:[#6b7280] my-4 h-[54px] w-[400px] overflow-x-auto rounded-[50px] bg-[#e9e9e9] ps-[70px] font-light hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F]"
                      placeholder="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <FaUser
                      color="#D9B9A0"
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-xl"
                    />
                  </>
                )}
              </div>
              <div className="email relative">
                <input
                  className="placeholder:[#6b7280] my-4 h-[54px] w-[400px] overflow-x-auto rounded-[30px] bg-[#e9e9e9] ps-[70px] font-light hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F]"
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdEmail
                  color="#D9B9A0"
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-xl"
                />
              </div>

              <div className="password relative">
                <input
                  className="placeholder:[#6b7280] my-4 h-[54px] w-[400px] overflow-x-auto rounded-[30px] bg-[#e9e9e9] ps-[70px] font-light hover:bg-[#D9D9D9CC] focus:outline-none focus:outline-[#2F4F4F]"
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLockPasswordFill
                  color="#D9B9A0"
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-xl"
                />
              </div>
              <button
                type="submit"
                className="bg-green w-max rounded-lg px-4 py-2 text-white hover:bg-[#6f4717]"
                id="submit"
              >
                {change}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
