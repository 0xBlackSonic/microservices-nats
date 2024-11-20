import { ReactNode } from "react";
import { useSession } from "./providers/session-provider";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authUser } = useSession();

  if (authUser === null) {
    return <Navigate to="/signin" replace={true} />;
  }

  return children;
}
