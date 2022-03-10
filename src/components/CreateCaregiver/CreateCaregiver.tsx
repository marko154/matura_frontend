import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate } from "solid-app-router";
import { Component, createSignal, Match, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { MainWrapper } from "../common/MainWrapper";
import { Button } from "../common/Button/Button";
import { Map } from "../common/Map";
import { SelectMentor } from "./SelectMentor";
import { CaregiverPersonalInfo } from "./CaregiverPersonalInfo";
import { AvailibilityFields, SelectAvailibility } from "./SelectAvailability";

const CreateCaregiver: Component = () => {
  const [t] = useI18n();
  const navigate = useNavigate();

  const [step, setStep] = createSignal(4);
  const [caregiver, setCaregiver] = createStore({
    email: "",
    first_name: "",
    last_name: "",
    emso: "",
    date_of_birth: "",
    gender: "MALE",
    phone_number: "",
    additional_info: "",
    mentor_id: -1,
    location: {},
    availibilities: [] as AvailibilityFields[],
  });

  const handleMapResult = (result: any) => {
    setCaregiver("location", result);
  };

  const handleSelectMentor = (mentor: Mentor) => {
    console.log(mentor);
    setCaregiver("mentor_id", mentor.mentor_id as number);
  };

  const addAvailibility = (availibility: AvailibilityFields) => {
    setCaregiver("availibilities", [...caregiver.availibilities, availibility]);
  };

  return (
    <MainWrapper title={t("caregiver.createCaregiver")}>
      <Switch>
        <Match when={step() === 1}>
          <CaregiverPersonalInfo
            setStep={setStep}
            caregiver={caregiver}
            setCaregiver={setCaregiver}
          />
        </Match>
        <Match when={step() === 2}>
          <Map onResult={handleMapResult} className="flex-1" />
          <div class="flex gap-3 justify-end mt-8 mb-12">
            <Button onClick={() => setStep(1)} action="secondary">
              {t("back")}
            </Button>
            <Button onClick={() => setStep(3)} disabled={!caregiver.location.place_name}>
              {t("continue")}
            </Button>
          </div>
        </Match>
        <Match when={step() === 3}>
          <SelectMentor
            mentorID={caregiver.mentor_id}
            setMentor={handleSelectMentor}
            caregiver={caregiver}
            setStep={setStep}
          />
        </Match>
        <Match when={step() === 4}>
          <SelectAvailibility
            setStep={setStep}
            caregiver={caregiver}
            addAvailibility={addAvailibility}
          />
        </Match>
      </Switch>
    </MainWrapper>
  );
};

export default CreateCaregiver;
