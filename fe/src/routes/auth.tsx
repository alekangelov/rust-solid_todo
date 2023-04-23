import { Show, createEffect, createMemo } from "solid-js";
import { useMatch, useSearchParams } from "solid-start";
import { styled } from "solid-styled-components";
import { Logo } from "~/components/Logo";
import { notifications } from "~/components/toasts";
import { authFns } from "~/data";
import auth, { useNoLoginRoute } from "~/state/auth";

const Styles = {
  Main: styled("div")`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  `,
  Wrapper: styled("div")`
    width: 400px;
    max-width: 90%;
  `,
  Title: styled("div")`
    display: flex;
    gap: 24px;
    align-items: center;
    margin-bottom: 12px;
  `,
  FModal: styled("div")`
    background: var(--surface);
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 24px 64px -36px rgba(0, 0, 0, 0.25);
    .subButton {
      all: unset;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      text-align: center;
      transition: 0.2s ease-out color;
      &:hover {
        color: var(--primary);
      }
    }
    h2 {
      margin: 0;
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 29px;
      letter-spacing: -0.02em;
    }
    h3 {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      margin: 0;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    input {
      background: var(--background);
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-family: "Inter Tight", sans-serif;
      outline: none;
      transition: 0.2s ease-out box-shadow;
      &:focus {
        outline: none;
        box-shadow: 0px 0px 0px 2px var(--primary);
      }
    }
    .submit {
      background: var(--primary);
      color: var(--on-primary);
      outline: none;
      font-weight: 900;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      transition: 0.2s ease-out;
      cursor: pointer;
      &:hover {
        filter: brightness(1.1);

        box-shadow: 0px 10px 20px -5px var(--primary);
      }
      &:active {
        filter: brightness(0.9);
      }
      &:focus {
        box-shadow: 0px 10px 20px -5px var(--primary);
      }
    }
  `,
};

const stringToBoolean = (str?: string) => {
  switch (str?.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
      return true;
    default:
      return false;
  }
};

const copy = {
  ["false"]: {
    title: "Login",
    subtitle: "Welcome back! Login to continue.",
    subButton: "Don't have an account?",
    subSubButton: "Register!",
  },
  ["true"]: {
    title: "Register",
    subtitle: "Welcome! Register to continue.",
    subButton: "Already have an account?",
    subSubButton: "Login!",
  },
};

const boolToString = (bool?: boolean): "true" | "false" =>
  bool ? "true" : "false";

export default function LoginRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  useNoLoginRoute();
  const isRegister = createMemo(() => stringToBoolean(searchParams.register));
  const { login } = auth;
  console.log(import.meta.env);
  return (
    <Styles.Main>
      <Styles.Wrapper>
        <Styles.Title>
          <div class="icon">
            <Logo width="64" height="64" />
          </div>
          <h1>Todoifier</h1>
        </Styles.Title>
        <Styles.FModal>
          <h2>{copy[boolToString(isRegister())].title}</h2>
          <h3>{copy[boolToString(isRegister())].subtitle}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const [username, password, password_confirmation] = [
                data.get("username") as string,
                data.get("password") as string,
                data.get("password_confirmation") as string,
              ];
              if (isRegister()) {
                return;
              }
              authFns
                .login({ username, password })
                .then((e) => e?.access_token && login(e?.access_token))
                .catch((e) =>
                  notifications.create({
                    type: "error",
                    message: e,
                  })
                );
            }}
          >
            <input
              required
              type="text"
              name="username"
              placeholder="Username"
            />
            <input
              required
              name="password"
              type="password"
              minLength={6}
              placeholder="Password"
            />
            <Show when={isRegister()}>
              <input
                required
                minLength={6}
                name="password_confirmation"
                type="password"
                placeholder="Password Confirmation"
              />
            </Show>
            <button class="submit">Submit</button>
          </form>
          <button
            onClick={() => {
              console.log(isRegister());
              setSearchParams({ register: isRegister() ? undefined : "true" });
            }}
            class="subButton"
          >
            {copy[boolToString(isRegister())].subButton}
            <b> {copy[boolToString(isRegister())].subSubButton}</b>
          </button>
        </Styles.FModal>
      </Styles.Wrapper>
    </Styles.Main>
  );
}
