import { onMount } from "solid-js";
import auth, { useProtectedRoute } from "~/state/auth";

export default function Logout() {
  onMount(() => auth.logout());
  useProtectedRoute();
  return <div></div>;
}
