import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component, createEffect, JSX, on, onCleanup } from "solid-js";
import createDebounce from "@solid-primitives/debounce";
import { Input } from "../common/Input/Input";
import { createStore, SetStoreFunction } from "solid-js/store";
import { TextArea } from "../common/Textarea/TextArea";
import { Button } from "../common/Button/Button";
import { checkEmailAvailable } from "../../http/auth";
import { isValidEmail } from "../../utils/strings.utils";
import { getAge, toDateInputValue } from "../../utils/date.utils";
import { checkEmsoAvailable } from "../../http/caregivers";

type Props = JSX.IntrinsicElements["form"] & {
  setCaregiver: SetStoreFunction<any>;
  setStep: (step: number) => void;
  caregiver: any;
};

export const CaregiverPersonalInfo: Component<Props> = ({
  setCaregiver,
  setStep,
  caregiver,
}) => {
  const [t] = useI18n();

  const handleChange = (e: any) => {
    setCaregiver(e.target.name, e.target.value);
  };

  const [emailAvailable, setEmailAvailable] = createStore({
    available: null,
    loading: false,
  });

  const checkEmail = async () => {
    try {
      const res = await checkEmailAvailable(caregiver.email);
      setEmailAvailable("available", res.available);
    } catch (err) {}
    setEmailAvailable("loading", false);
  };
  const [debounced, cancelEmailCheck] = createDebounce(checkEmail, 500);
  createEffect(() => {
    if (!caregiver.email || !isValidEmail(caregiver.email)) return;
    setEmailAvailable("loading", true);
    debounced();
  });

  const [emsoAvailable, setEmsoAvailable] = createStore({
    available: null,
    loading: false,
  });

  const checkEmso = async () => {
    try {
      const res = await checkEmsoAvailable(caregiver.emso);
      setEmsoAvailable("available", res.available);
    } catch (err) {}
    setEmsoAvailable("loading", false);
  };
  const [debounced2, cancelEmsoCheck] = createDebounce(checkEmso, 500);
  createEffect(() => {
    if (!caregiver.emso) return;
    setEmsoAvailable("loading", true);
    debounced2();
  });

  onCleanup(() => {
    cancelEmailCheck();
    cancelEmsoCheck();
  });

  function ageValid() {
    return getAge(caregiver.date_of_birth) >= 18;
  }

  const getMaxDate = () => {
    return new Date(new Date().setFullYear(new Date().getFullYear() - 18));
  };

  const emailIcon = () => {
    const { available } = emailAvailable;
    return available === null ? "mail_outline" : available === true ? "done" : "close";
  };

  const emsoIcon = () => {
    const { available } = emsoAvailable;
    return available === null ? "badge" : available === true ? "done" : "close";
  };

  const canContinue = () => {
    return (
      emailAvailable.available &&
      emsoAvailable.available &&
      caregiver.phone_number &&
      caregiver.date_of_birth &&
      caregiver.first_name &&
      caregiver.last_name &&
      ageValid()
    );
  };

  return (
    <form style="min-width: 480px;" className="m-auto mt-10 flex flex-col gap-2">
      <Input
        type="email"
        label={`${t("email")}${
          emailAvailable.available === false ? " - " + t("emailTaken") : ""
        }`}
        onInput={handleChange}
        name="email"
        version="secondary"
        icon={emailIcon()}
        error={emailAvailable.available === false}
        loading={emailAvailable.loading}
      />
      <Input
        label={t("firstName")}
        onInput={handleChange}
        name="first_name"
        version="secondary"
      />
      <Input
        label={t("lastName")}
        onInput={handleChange}
        name="last_name"
        version="secondary"
      />
      <Input
        label={
          emsoAvailable.available === false ? "EMŠO - This EMŠO is already taken" : "EMŠO"
        }
        onInput={handleChange}
        name="emso"
        maxLength={13}
        version="secondary"
        icon={emsoIcon()}
        loading={emsoAvailable.loading}
        error={emsoAvailable.available === false}
      />
      <Input
        label={t("phoneNumber")}
        onInput={handleChange}
        name="phone_number"
        type="tel"
        version="secondary"
        icon="phone"
      />
      <Input
        type="date"
        label={
          caregiver.date_of_birth && !ageValid()
            ? t("dateOfBirth") + " - Age has to be 18 or more"
            : t("dateOfBirth")
        }
        max={toDateInputValue(getMaxDate())}
        onInput={handleChange}
        name="date_of_birth"
        version="secondary"
        warning={caregiver.date_of_birth && !ageValid()}
      />
      <TextArea
        label={"Additional information"}
        onInput={handleChange}
        name="additional_info"
        version="secondary"
        className="mt-2"
      />
      <Button
        onClick={() => setStep(2)}
        className="mt-4 w-full"
        disabled={!canContinue()}
      >
        {t("continue")}
      </Button>
    </form>
  );
};
