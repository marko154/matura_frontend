import { Component, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { useI18n } from "@amoutonbrady/solid-i18n";
import { useAuth } from "./../context/AuthProvider";
import { isValidEmail } from "./../utils/strings.utils";

import { Button } from "./common/Button/Button";
import { Input } from "./common/Input/Input";
import { Link } from "solid-app-router";
import { toast } from "./common/Toast/Toast";
import { requestPasswordReset } from "../http/auth";
import { Message } from "./common/Message/Message";
import { getErrorMessage } from "../utils/errors";
import { JSX } from "solid-js";

const SignIn: Component = () => {
  const [t] = useI18n();
  const [, { login, googleLogin }] = useAuth();

  const [state, setState] = createStore({
    email: "marko.gartnar777@gmail.com",
    password: "",
    error: "",
    loading: false,
    googleLoading: false,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setState("loading", true);
    try {
      await login({
        email: state.email,
        password: state.password,
      });
    } catch (err: unknown) {
      setState("error", getErrorMessage(err));
    }
    setState("loading", false);
  };

  const handleChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const { value, name } = e.currentTarget;
    setState(name as "email" | "password", value);
  };

  const isValid = () => {
    return (
      state.email.length > 0 &&
      // isValidEmail(state.email) &&
      state.password.length > 0
    );
  };

  const handleGoogleSignin = async () => {
    try {
      setState("googleLoading", true);
      await googleLogin();
    } catch (err: unknown) {
      setState("error", getErrorMessage(err));
    }
    setState("googleLoading", false);
  };

  const handlePasswordReset = async () => {
    try {
      await requestPasswordReset(state.email);
      toast({
        text: t("instructionsSent", { email: state.email }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center w-full h-full items-center">
      <div className="w-11/12 max-w-sm">
        <h1 className="text-4xl text-primary uppercase">{t("signin")}</h1>
        <form className="mt-10">
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              onInput={handleChange}
              error={state.error !== ""}
              value={state.email}
              label={t("email")}
              disabled={state.loading}
              name="email"
            />
            <Input
              type="password"
              onInput={handleChange}
              error={state.error !== ""}
              value={state.password}
              name="password"
              label={t("password")}
              disabled={state.loading}
              required
            />
            <button
              type="button"
              className="-mt-2 ml-1 text-left text-sm text-primary hover:underline"
              classList={{ "text-red-600": state.error !== "" }}
              onClick={handlePasswordReset}
            >
              {t("forgotPassword")}
            </button>
          </div>
          <Button
            className="w-full mt-14"
            onClick={handleSubmit}
            disabled={!isValid() || state.loading || state.googleLoading}
            loading={state.loading}
          >
            {t("signin")}
          </Button>
          <Button
            className="w-full mt-2"
            onClick={handleGoogleSignin}
            action="google"
            type="button"
            loading={state.googleLoading}
            disabled={state.loading || state.googleLoading}
          >
            {t("continueWithGoogle")}
          </Button>

          {/* <div className="text-center text-primary mt-3">
            {t("dontHaveAcc")}&nbsp;
            <Link href="/signup" className="text-blue-700">
              {t("signup")}
            </Link>
          </div> */}
        </form>

        <Show when={state.error}>
          <Message className="mt-2">{String(state.error)}</Message>
        </Show>
      </div>
    </div>
  );
};

export default SignIn;
