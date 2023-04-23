import { Navigate } from "solid-start";
import auth from "../state/auth";

export default function Home() {
  const { isAuthenticated } = auth;



  if (isAuthenticated()) return <Navigate href="/dashboard" />;
  return <Navigate href="/auth" />;
}
