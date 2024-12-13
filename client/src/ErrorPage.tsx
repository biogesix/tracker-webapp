import { useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError() as Error;
  console.error(error);

  return (
    <div>
      <div>ErrorPage</div>
      <p>error: {error.message}</p>
    </div>
  );
};

export default ErrorPage;
