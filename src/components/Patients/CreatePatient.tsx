import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { MainWrapper } from "../common/MainWrapper";
import createDebounce from "@solid-primitives/debounce";
import { Input } from "../common/Input/Input";
import { Button } from "../common/Button/Button";
import { useNavigate } from "solid-app-router";
import { createPatient } from "../../http/patients";
import { Map } from "../common/Map";
import { toast } from "../common/Toast/Toast";

const CreatePatient: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [fn, cancel] = createDebounce(() => {}, 300);

  const [patient, setPatient] = createStore<Patient>({
    first_name: "",
    last_name: "",
    email: "",
    emso: "",
    date_of_birth: "",
    gender: "MALE",
    phone_number: "",
    location: undefined,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await createPatient(patient as Patient);
      toast({ text: "Patient successfully created" });
      navigate(`/patient/${res.patient.patient_id}`, { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: any) => {
    setPatient(e.target.name, e.target.value);
  };

  const canSubmit = () => {
    return Object.values(patient).every((val) => !!val);
  };

  const handleMapResult = (result: any) => {
    setPatient("location", result);
  };

  return (
    <MainWrapper title={t("patient.createPatient")}>
      <div class="flex gap-8 mx-auto mt-6" style="width: 95%">
        <Map onResult={handleMapResult} />

        <form className="max-w-md flex-1 flex flex-col gap-2">
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
            maxLength={13}
            icon="badge"
          />
          <Input
            version="secondary"
            type="email"
            label={t("email")}
            onInput={handleChange}
            name="email"
            icon="mail_outline"
          />
          <Input
            version="secondary"
            label={t("phoneNumber")}
            onInput={handleChange}
            name="phone_number"
            type="tel"
            icon="phone"
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
            className="block ml-auto mt-5"
          >
            {t("create")}
          </Button>
        </form>
      </div>
    </MainWrapper>
  );
};

export default CreatePatient;
