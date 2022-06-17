import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate, useParams, useSearchParams } from "solid-app-router";
import { Component, createResource, createSignal } from "solid-js";
import { resetPassword } from "../http/auth";
import { Button } from "./common/Button/Button";
import { Input } from "./common/Input/Input";
import { toast } from "./common/Toast/Toast";

const ResetPassword: Component = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [t] = useI18n();
  // const [data] = createResource(() => null);

  const handlePasswordReset = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      await resetPassword(params.token, password());
      console.log("yes");
      navigate("/");
      toast({ text: "Password was reset" });
    } catch (err) {
      toast({ text: "There was an error" });
    }
  };

  return (
    <div className="flex justify-center w-full h-full items-center">
      <div className="w-11/12 max-w-xs">
        <h1 className="text-4xl text-primary uppercase">{t("resetPassword")}</h1>
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
            className="mt-3"
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
