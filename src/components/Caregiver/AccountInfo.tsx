import { useI18n } from "@amoutonbrady/solid-i18n";
import { Component, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { useAuth } from "../../context/AuthProvider";
import { updateCaregiver } from "../../http/caregivers";
import { isAdmin } from "../../utils/roles.utils";
import { formatDate } from "../../utils/strings.utils";
import { Button } from "../common/Button/Button";
import { Input } from "../common/Input/Input";
import { Label } from "../common/Label";
import { toast } from "../common/Toast/Toast";
import { Map } from "../Patient/PatientInfo";

export const Segment: Component<{ title: string }> = ({ title, children }) => {
  return (
    <div className="px-7 py-5 border-b border-gray-200 flex">
      <div className="uppercase flex items-center mr-9 w-44 text-gray-700">{title}</div>

      <div className="flex gap-7 items-center">{children}</div>
    </div>
  );
};

type AccountInfoProps = JSX.IntrinsicElements["div"] & {
  caregiver: Caregiver & { user: User; mentor: Mentor; location: Location };
  refetchCaregiver: Function;
};

export const AccountInfo: Component<AccountInfoProps> = ({
  caregiver,
  refetchCaregiver,
}) => {
  const [t] = useI18n();
  const [{ user }] = useAuth();
  const initialState = {
    first_name: caregiver.first_name,
    last_name: caregiver.last_name,
    date_of_birth: caregiver.date_of_birth,
    phone_number: caregiver.phone_number,
    location: caregiver.location,
  };
  const [state, setState] = createStore({ ...initialState });

  const handleSaveChanges = async () => {
    try {
      const serialiezed = JSON.parse(JSON.stringify(state));
      if (state.location.location_id === caregiver.location_id) {
        delete serialiezed.location;
      }
      await updateCaregiver(caregiver.caregiver_id, {
        caregiver_id: caregiver.caregiver_id,
        ...serialiezed,
      });
      refetchCaregiver();
      toast({ text: "Succesfully updated" });
    } catch (err) {
      console.log(err);
      toast({ text: "Saving failed." });
    }
  };

  const handleCancel = () => {
    setState(initialState);
  };

  const handleChange = (e: any) => {
    setState(e.target.name, e.target.value);
  };

  const wereChangesMade = () => {
    return (
      state.first_name !== caregiver.first_name ||
      state.last_name !== caregiver.last_name ||
      state.date_of_birth !== caregiver.date_of_birth ||
      state.phone_number !== caregiver.phone_number ||
      state.location.location_id !== caregiver.location_id
    );
  };

  return (
    <div class="mb-9">
      <div className="flex justify-end pt-9 pb-2 gap-3">
        <h2 className="mr-auto text-lg text-gray-700 ml-7">{t("mentor.personalInfo")}</h2>

        {isAdmin(user!) && (
          <>
            <Button
              action="secondary"
              disabled={!wereChangesMade()}
              onClick={handleCancel}
            >
              {t("cancel")}
            </Button>
            <Button disabled={!wereChangesMade()} onClick={handleSaveChanges}>
              {t("saveChanges")}
            </Button>
          </>
        )}
      </div>
      <Segment title={t("user.emailAddress")}>
        <Input
          version="secondary"
          value={caregiver.user.email}
          style="min-width: 464px"
          disabled
        />
        <Label>{caregiver.user.email_validated ? "Confirmed" : "Not Confirmed"}</Label>
      </Segment>

      <Segment title={t("user.name")}>
        <Input
          version="secondary"
          name="first_name"
          value={state.first_name}
          onInput={handleChange}
          disabled={!isAdmin(user!)}
        />
        <Input
          version="secondary"
          name="last_name"
          value={state.last_name}
          onInput={handleChange}
          disabled={!isAdmin(user!)}
        />
      </Segment>

      <Segment title={t("user.activity")}>
        <Input
          version="secondary"
          label={t("user.registrationDate")}
          value={formatDate(caregiver.user.registration_date)}
          disabled
        />
        <Input
          version="secondary"
          label={t("user.lastLogin")}
          value={caregiver.user.last_login ? formatDate(caregiver.user.last_login) : ""}
          disabled
        />
      </Segment>

      <Segment title={t("user.dateOfBirth")}>
        <Input
          version="secondary"
          value={formatDate(caregiver.date_of_birth)}
          disabled={!isAdmin(user!)}
        />
      </Segment>

      <Segment title={t("user.phoneNumber")}>
        <Input
          version="secondary"
          type="tel"
          name="phone_number"
          value={state.phone_number}
          onInput={handleChange}
          disabled={!isAdmin(user!)}
        />
      </Segment>
      <Segment title={t("user.authentication")}>
        <Label>{t("user.emailAndPassword")}</Label>
        {caregiver.user.external_type && <Label>{caregiver.user.external_type}</Label>}
      </Segment>

      <div className="px-7 py-5 border-b border-gray-200 flex">
        <div className="uppercase flex mr-9 w-44 text-gray-700">{"Address"}</div>

        <div className="flex flex-1 flex-col gap-7">
          <div class="text-gray-700">{caregiver.location.place_name}</div>
          <Map
            coordinates={caregiver.location.coordinates}
            onResult={(res) => setState("location", res)}
          />
        </div>
      </div>
    </div>
  );
};
