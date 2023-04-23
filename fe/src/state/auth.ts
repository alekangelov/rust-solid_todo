import {
  createSignal,
  createMemo,
  createRoot,
  createEffect,
  Signal,
} from "solid-js";
import { useNavigate } from "solid-start";

function createStoredSignal<T>(key: string, defaultValue: T): Signal<T> {
  if (typeof window === "undefined") {
    return [() => defaultValue, (..._args: any[]) => {}] as any;
  }

  const storage = window.localStorage;

  const initialValue = storage?.getItem(key)
    ? (JSON.parse(storage?.getItem(key) as string) as T)
    : defaultValue;

  const [value, setValue] = createSignal<T>(initialValue);

  const setValueAndStore = ((arg) => {
    const v = setValue(arg);
    storage?.setItem(key, JSON.stringify(v));
    return v;
  }) as typeof setValue;

  return [value, setValueAndStore];
}

function createAuthState() {
  const [jwt, setJwt] = createStoredSignal<string | null>("jwt", null);
  const isAuthenticated = createMemo(() => Boolean(jwt()));
  const login = (jwt: string) => {
    setJwt(jwt);
  };
  const logout = () => {
    setJwt("null");
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
