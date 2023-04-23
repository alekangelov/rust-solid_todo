import auth from "../state/auth";
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

interface User {
  id: string;
  username: string;
}

interface Profile {
  name: string | null;
  bio: string | null;
  avatar: string | null;
}

export const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("jwt") || '""');
  } catch {
    auth.logout();
  }
};

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
  async me(): Promise<User> {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      });

      return await res.json();
    } catch {
      console.log("oops");
      auth.logout();
      throw new Error("Something wrong happened!");
    }
  },
  async profile(id?: string): Promise<Profile> {
    try {
      if (!id) throw new Error("Invalid id");
      const res = await fetch(
        import.meta.env.VITE_API_URL + `/api/user/${id}/profile`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      );
      return await res.json();
    } catch {
      throw new Error("Something wrong happened!");
    }
  },
};
