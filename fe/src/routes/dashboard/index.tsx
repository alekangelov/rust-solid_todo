import { Layout } from "~/components/Layout";
import { useProtectedRoute } from "~/state/auth";

export default function DashboardRoute() {
  useProtectedRoute();
  return <Layout name="Dashboard"></Layout>;
}
