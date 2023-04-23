import { createMemo, createRoot, createEffect } from "solid-js";
import { useNavigate } from "solid-start";
import { createStoredSignal } from "./storage";

function createAuthState() {
  const [jwt, setJwt] = createStoredSignal<string | null>("jwt", null);
  const isAuthenticated = createMemo(() => Boolean(jwt()));
  const login = (jwt: string) => {
    setJwt(jwt);
  };
  const logout = () => {
    setJwt(null);
  };

  return { login, logout, isAuthenticated };
}
const rootState = createRoot(createAuthState);

export const useProtectedRoute = () => {
  const navigate = useNavigate();
  createEffect(() => {
    if (!rootState.isAuthenticated()) {
      navigate("/auth");
    }
  });
};

export const useNoLoginRoute = () => {
  const navigate = useNavigate();
  createEffect(() => {
    if (rootState.isAuthenticated()) {
      navigate("/dashboard");
    }
  });
};

export default rootState;
