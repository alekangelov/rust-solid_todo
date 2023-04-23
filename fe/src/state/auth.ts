import { createSignal, createMemo, createRoot } from "solid-js";


function createAuthState() {
  const [jwt, setJwt] = createSignal<string | null>(null);
  const isAuthenticated = createMemo(() => Boolean(jwt()));
  const login = (jwt: string) => setJwt(jwt);
  const logout = () => setJwt(null);

  return { login, logout, isAuthenticated }
}

export default createRoot(createAuthState)
