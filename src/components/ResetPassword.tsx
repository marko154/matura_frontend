import { useI18n } from "@amoutonbrady/solid-i18n";
import { useParams } from "solid-app-router";
import { Component, createResource, createSignal } from "solid-js";
import { Button } from "./common/Button/Button";
import { Input } from "./common/Input/Input";

const ResetPassword: Component = () => {
  const params = useParams();
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [t] = useI18n();
  // const [data] = createResource(() => null);

  const handlePasswordReset = (e: MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center w-full h-full items-center">
      <div className="w-11/12 max-w-xs">
        <h1 className="text-4xl text-primary uppercase">
          {t("resetPassword")}
        </h1>
        <form className="mt-10">
          <Input
            type="password"
            onInput={(e) => setPassword(e.currentTarget.value)}
            value={password()}
            name="password"
            label={t("password")}
            // disabled={date.loading}
            required
          />
          <Input
            type="password"
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            value={confirmPassword()}
            name="confirm password"
            label={t("confirmPassword")}
            // disabled={date.loading}
            required
          />

          <Button onClick={handlePasswordReset} className="w-full mt-14">
            {t("resetPassword")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
