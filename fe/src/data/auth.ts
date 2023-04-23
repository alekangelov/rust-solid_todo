interface LoginInput {
  username: string;
  password: string;
}

interface AuthOutput {
  access_token: string;
}

interface RegisterInput {
  username: string;
  password: string;
  password_confirmation: string;
}

export const authFns = {
  async login(data: LoginInput): Promise<AuthOutput | undefined> {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        return await res.json();
      }
      throw await res.json();
    } catch (e: any) {
      throw e?.message || "Something wrong happened!";
    }
  },
  async register(data: RegisterInput): Promise<AuthOutput> {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        return await res.json();
      }
      throw await res.json();
    } catch (e: any) {
      throw e?.message || "Something wrong happened!";
    }
  },
};
