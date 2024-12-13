import { Link } from "react-router";

const NotLoggedIn = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1>You are not logged in</h1>
      <Link to={"/login"}>Log In here</Link>
    </div>
  );
};

export default NotLoggedIn;
