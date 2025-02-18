import { Navigate } from "react-router";
import { getAuthInfo } from "../services/token";

type ProtectedProps = {
  children: React.ReactNode;
};

const Protected = ({ children }: ProtectedProps) => {
  const user = getAuthInfo();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
