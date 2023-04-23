import { useProtectedRoute } from "~/state/auth";

export default function DashboardRoute() {
  useProtectedRoute();
  return <div>Fake Dash here</div>;
}
