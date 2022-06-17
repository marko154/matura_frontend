import { createStore } from "solid-js/store";
import { Button } from "./common/Button/Button";
import { Input } from "./common/Input/Input";
import { useI18n } from "@amoutonbrady/solid-i18n";
import * as auth from "../http/auth";
import { Link, useNavigate, useSearchParams } from "solid-app-router";
import { createEffect, createResource, For } from "solid-js";
import { getErrorMessage } from "../utils/errors";
import { Message } from "./common/Message/Message";
import { Loader } from "./common/Loader/Loader";
import { useAuth } from "../context/AuthProvider";
import { toast } from "./common/Toast/Toast";

const MIN_PASSWORD_LENGTH = 10;

const SignUp = () => {
  const [t] = useI18n();
  const [params] = useSearchParams();
  const [state, setState] = createStore({
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    loading: false,
    googleLoading: false,
  });
  const navigate = useNavigate();
  const [, { googleLogin }] = useAuth();

  const [user] = createResource(() => auth.verifyToken(params.token));

  createEffect(() => {
    if (user()) setState("email", user().email);
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setState("loading", true);
      const user = await auth.register(state);
      navigate("/");
      toast({ text: "Successfully registered" });
    } catch (err) {
      setState("error", getErrorMessage(err));
    }
    setState("loading", false);
  };

  const handleChange = (e: any) => {
    const { value, name } = e.currentTarget;
    setState(name, value);
  };

  const isValid = () => {
    return (
      state.confirmPassword === state.password &&
      state.password.length > 0 &&
      state.email.length > 0
    );
  };

  const handleGoogleSignup = async () => {
    try {
      setState("googleLoading", true);
      await googleLogin();
    } catch (err: unknown) {
      setState("error", getErrorMessage(err));
    }
    setState("googleLoading", false);
  };

  // add upper/lower case, numbers, special characters requirement
  const getFormErrors = () => {
    const errors = [];
    const pwdLength = state.password.length;
    if (pwdLength < MIN_PASSWORD_LENGTH) {
      errors.push(`Password must have at least ${MIN_PASSWORD_LENGTH} characters`);
    }
    if (pwdLength > 0 && state.password !== state.confirmPassword) {
      errors.push("The passwords must match");
    }
    return errors;
  };

  return (
    <div className="flex justify-center w-full h-full items-center">
      <div className="w-11/12 max-w-sm">
        <h1 className="text-4xl text-primary uppercase">{t("signup")}</h1>
        {params.token === undefined ? (
          <Message>Token was not provided</Message>
        ) : user.error && false ? (
          <Message>Token is invalid</Message>
        ) : (
          <form className="mt-10">
            <div className="flex flex-col gap-3 relative">
              <Input
                type="text"
                onInput={handleChange}
                value={state.email}
                label={t("email")}
                name="email"
                disabled
                loading={user.loading}
              />
              <Input
                type="password"
                onInput={handleChange}
                value={state.password}
                name="password"
                label={t("password")}
                required
              />
              <Input
                type="password"
                onInput={handleChange}
                value={state.confirmPassword}
                name="confirmPassword"
                label={t("confirmPassword")}
                required
              />
              {getFormErrors().length && (
                <ul class="text-gray-700 ml-6">
                  <For each={getFormErrors()}>
                    {(error) => <li class="text-sm list-disc">{error}</li>}
                  </For>
                </ul>
              )}
            </div>
            <Button
              className="w-full mt-14"
              onClick={handleSubmit}
              disabled={!isValid() || state.loading || state.googleLoading}
              loading={state.googleLoading}
            >
              {t("signup")}
            </Button>
            <Button
              className="w-full mt-2"
              onClick={handleGoogleSignup}
              action="google"
              type="button"
              loading={state.googleLoading}
            >
              {t("continueWithGoogle")}
            </Button>
            <div className="text-center text-primary mt-3">
              {t("alreadyHaveAcc")}&nbsp;
              <Link href="/signin" className="text-blue-700">
                {t("signin")}
              </Link>
            </div>
            {state.error && <Message className="mt-4">{state.error}</Message>}
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
