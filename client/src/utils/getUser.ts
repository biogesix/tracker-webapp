import { supabase } from "./UserContext";

const getUser = async () => {
  const { data: userData, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/user?email=${userData.user.email!}`
  );

  if (!response.ok) {
    throw Error("No user hahaha");
  }

  const { data } = await response.json();
  return data;
};

export default getUser;
