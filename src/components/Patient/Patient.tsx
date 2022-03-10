import { useI18n } from "@amoutonbrady/solid-i18n";
import { useParams } from "solid-app-router";
import { Component, createEffect, createResource, Show } from "solid-js";
import { getPatient } from "../../http/patients";
import { Avatar } from "../common/Avatar";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";
import { Message } from "../common/Message/Message";
import { Tabs } from "../common/Tabs";
import { AssignCaregiver } from "./AssignCaregiver";
import { EmergencyContacts } from "./EmergencyContacts";
import { PatientInfo } from "./PatientInfo";
import { PatientSessions } from "./PatientSessions";

const Patient: Component = () => {
  const params = useParams();
  // fetch mentor based on the id path parameter
  const [patient, { refetch }] = createResource(() => params.id, getPatient);
  const [t] = useI18n();

  createEffect(() => {
    console.log(patient());
  });

  return (
    <MainWrapper>
      <Show
        when={!patient.loading}
        fallback={patient.error ? <Message>An error has occured.</Message> : <Loader />}
      >
        <div className="flex mt-8 mb-11 gap-9 items-center">
          <Avatar imageURL={undefined} size="w-20 h-20" />
          <div>
            <h1 className="text-2xl text-gray-700">
              {`${patient()!.first_name} ${patient()!.last_name}`}
            </h1>
            <div class="uppercase">{t("patient.patient")}</div>
          </div>
        </div>
        <Tabs
          defaultIndex={0}
          panes={[
            {
              title: "Assign a Caregiver",
              element: () => <AssignCaregiver patient={patient()!} />,
            },
            {
              title: "Personal Info",
              element: () => (
                <PatientInfo patient={patient()!} refetchPatient={refetch} />
              ),
            },
            {
              title: "Sessions",
              element: () => <PatientSessions />,
            },
            {
              title: "Emergency Contacts",
              element: () => <EmergencyContacts />,
            },
          ]}
        />
      </Show>
    </MainWrapper>
  );
};

export default Patient;
