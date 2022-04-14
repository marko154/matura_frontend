import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { MainWrapper } from "../common/MainWrapper";
import { Input } from "../common/Input/Input";
import { Button } from "../common/Button/Button";
import { createMentor } from "../../http/mentors";
import { useNavigate } from "solid-app-router";
import { checkEmailAvailable } from "../../http/auth";
import { isValidEmail } from "../../utils/strings.utils";
import debounce from "lodash.debounce";
import { toast } from "../common/Toast/Toast";

const CreateMentor: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);
  const [mentor, setMentor] = createStore<Mentor & { email: string }>({
    email: "",
    first_name: "",
    last_name: "",
    emso: "",
    date_of_birth: "",
    gender: "MALE",
    phone_number: "",
  });
  const [emailAvailable, setEmailAvailable] = createStore({
    available: null,
    loading: false,
  });

  let debounced: any;
  createEffect(() => {
    if (debounced) debounced.cancel();
    if (isValidEmail(mentor.email)) {
      setEmailAvailable("loading", true);
      debounced = debounce(async () => {
        try {
          const res = await checkEmailAvailable(mentor.email);
          setEmailAvailable("available", res.available);
        } catch (err) {}
        setEmailAvailable("loading", false);
      }, 500);
      debounced();
    }
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { user } = await createMentor(mentor);
      toast({ text: "Mentor successfully created" });
      navigate(`/mentor/${user.mentor.mentor_id}`, { replace: true });
    } catch (err) {
      toast({ text: "Something went wrong" });
      console.log(err);
    }
    setLoading(false);
  };

  const handleChange = (e: any) => {
    setMentor(e.target.name, e.target.value);
  };

  const canSubmit = () => {
    return Object.values(mentor).every((val) => val !== "");
  };

  const emailIcon = () => {
    const { available } = emailAvailable;
    return available === null ? "mail_outline" : available === true ? "done" : "close";
  };

  return (
    <MainWrapper>
      <div className="mx-auto" style="min-width: 480px">
        <h1 className="mt-16 mb-10 text-3xl text-gray-700">{t("mentor.createMentor")}</h1>
        <form className="flex flex-col gap-2">
          <Input
            version="secondary"
            type="email"
            label={`${t("email")}${
              emailAvailable.available === false ? " - " + t("emailTaken") : ""
            }`}
            onInput={handleChange}
            name="email"
            icon={emailIcon()}
            error={emailAvailable.available === false}
            loading={emailAvailable.loading}
            autofocus
          />
          <Input
            version="secondary"
            label={t("firstName")}
            onInput={handleChange}
            name="first_name"
          />
          <Input
            version="secondary"
            label={t("lastName")}
            onInput={handleChange}
            name="last_name"
          />
          <Input
            version="secondary"
            label="EMŠO"
            onInput={handleChange}
            name="emso"
            maxlength={13}
          />
          <Input
            version="secondary"
            label={t("phoneNumber")}
            onInput={handleChange}
            name="phone_number"
            icon="phone"
            type="tel"
          />
          <Input
            version="secondary"
            type="date"
            label={t("dateOfBirth")}
            onInput={handleChange}
            name="date_of_birth"
          />
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            loading={loading()}
            className="block ml-auto mt-5"
          >
            {t("create")}
          </Button>
        </form>
      </div>
    </MainWrapper>
  );
};

export default CreateMentor;
