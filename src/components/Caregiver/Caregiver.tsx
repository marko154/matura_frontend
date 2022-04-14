import { useI18n } from "@amoutonbrady/solid-i18n";
import { useParams } from "solid-app-router";
import { Component, createEffect, createResource, Show } from "solid-js";
import { getCaregiver } from "../../http/caregivers";
import { Avatar } from "../common/Avatar";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";
import { Tabs } from "../common/Tabs";
import { AccountInfo } from "./AccountInfo";
import { AssignToPatient } from "./AssignToPatient";
import { Availibility } from "./Availibility";
import { CaregiverSessions } from "./CaregiverSessions";

const Caregiver: Component = () => {
  const params = useParams();
  const [t] = useI18n();
  const [caregiver, { refetch }] = createResource(() => params.id, getCaregiver);
  createEffect(() => {
    console.log(caregiver());
  });
  return (
    <MainWrapper>
      <Show when={!caregiver.loading} fallback={<Loader />}>
        <div className="flex mt-8 mb-11 gap-9 items-center">
          <Avatar imageURL={caregiver()!.user.avatar_url} size="w-20 h-20" />
          <div>
            <h1 className="text-2xl text-gray-700">
              {caregiver()!.user.display_name ||
                `${caregiver()!.first_name} ${caregiver()!.last_name}`}
            </h1>
            <div class="uppercase">{t("caregiver.caregiver")}</div>
          </div>
        </div>
        <Tabs
          panes={[
            {
              title: t("mentor.accountInfo"),
              element: () => (
                <AccountInfo caregiver={caregiver()!} refetchCaregiver={refetch} />
              ),
            },
            {
              title: t("caregiver.sessions"),
              element: () => <CaregiverSessions />,
            },
            // {
            //   title: t("caregiver.assignPatient"),
            //   element: () => <AssignToPatient />,
            // },
            {
              title: t("caregiver.availibility"),
              element: () => <Availibility />,
            },
          ]}
        />
      </Show>
    </MainWrapper>
  );
};

export default Caregiver;
