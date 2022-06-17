import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate, useParams } from "solid-app-router";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  getCaregivers,
  getMentor,
  updateMentor,
  getAssignableCaregivers,
  assignCaregivers,
  unassignCaregivers,
} from "../../http/mentors";
import { formatDate } from "../../utils/strings.utils";
import { Avatar } from "../common/Avatar";
import { Button } from "../common/Button/Button";
import { Checkbox } from "../common/Checkbox";
import { InlineSelect } from "../common/InlineSelect";
import { Input } from "../common/Input/Input";
import { Label } from "../common/Label";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";
import { Message } from "../common/Message/Message";
import { Table } from "../common/Table/Table";
import { Tabs } from "../common/Tabs";
import { toast } from "../common/Toast/Toast";
import createDebounce from "@solid-primitives/debounce";
import { Pagination } from "../common/Pagination";

const Segment: Component<{ title: string }> = ({ title, children }) => {
  return (
    <div className="px-7 py-5 border-b border-gray-200 flex">
      <div className="uppercase flex items-center mr-9 w-44 text-gray-700">{title}</div>

      <div className="flex gap-7 items-center">{children}</div>
    </div>
  );
};

type MentorData = Mentor & { user: User };

const AccountInfo: Component<{ mentor: MentorData; refetchMentor: Function }> = ({
  mentor,
  refetchMentor,
}) => {
  const initialState = {
    first_name: mentor.first_name,
    last_name: mentor.last_name,
    date_of_birth: mentor.date_of_birth,
    phone_number: mentor.phone_number,
  };
  const [state, setState] = createStore({ ...initialState });
  const [t] = useI18n();

  const handleChange = (e: any) => {
    setState(e.target.name, e.target.value);
  };

  const wereChangesMade = () => {
    return (
      state.first_name !== mentor.first_name ||
      state.last_name !== mentor.last_name ||
      state.date_of_birth !== mentor.date_of_birth ||
      state.phone_number !== mentor.phone_number
    );
  };

  const handleSaveChanges = async () => {
    try {
      const serialiezed = JSON.parse(JSON.stringify(state));
      await updateMentor({ mentor_id: mentor.mentor_id, ...serialiezed });
      refetchMentor();
      toast({ text: "Succesfully updated" });
    } catch (err) {
      toast({ text: "Saving failed." });
    }
  };

  const handleCancel = () => {
    setState(initialState);
  };

  return (
    <div class="mb-9">
      <div className="flex justify-end pt-9 pb-2 gap-3">
        <h2 className="mr-auto text-lg text-gray-700 ml-7">{t("mentor.personalInfo")}</h2>
        <Button action="secondary" disabled={!wereChangesMade()} onClick={handleCancel}>
          {t("cancel")}
        </Button>
        <Button disabled={!wereChangesMade()} onClick={handleSaveChanges}>
          {t("saveChanges")}
        </Button>
      </div>
      <Segment title={t("user.emailAddress")}>
        <Input
          version="secondary"
          value={mentor.user.email}
          style="min-width: 464px"
          disabled
        />
        <Label>{mentor.user.email_validated ? "Confirmed" : "Not Confirmed"}</Label>
      </Segment>

      <Segment title={t("user.name")}>
        <Input
          version="secondary"
          name="first_name"
          value={state.first_name}
          onInput={handleChange}
        />
        <Input
          version="secondary"
          name="last_name"
          value={state.last_name}
          onInput={handleChange}
        />
      </Segment>

      <Segment title={t("user.activity")}>
        <Input
          version="secondary"
          label={t("user.registrationDate")}
          value={formatDate(mentor.user.registration_date)}
          disabled
        />
        <Input
          version="secondary"
          label={t("user.lastLogin")}
          value={mentor.user.last_login ? formatDate(mentor.user.last_login) : ""}
          disabled
        />
      </Segment>

      <Segment title={t("user.dateOfBirth")}>
        <Input version="secondary" value={formatDate(mentor.date_of_birth)} />
      </Segment>

      <Segment title={t("user.phoneNumber")}>
        <Input
          version="secondary"
          type="tel"
          name="phone_number"
          value={state.phone_number}
          onInput={handleChange}
        />
      </Segment>
      <Segment title={t("user.authentication")}>
        <Label>{t("user.emailAndPassword")}</Label>
        {mentor.user.external_type && <Label>{mentor.user.external_type}</Label>}
      </Segment>
    </div>
  );
};

const MentorCaregivers: Component = () => {
  const params = useParams();
  const [caregivers, { refetch }] = createResource(() => params.id, getCaregivers);
  const navigate = useNavigate();
  const [t] = useI18n();

  const redirect = (id: string) => {
    navigate(`/caregiver/${id}`);
  };

  const handleUnassign = async (e: any, caregiver_id: number) => {
    e.stopPropagation();
    try {
      await unassignCaregivers(params.id, [caregiver_id]);
      toast({ text: "Success" });
      refetch();
    } catch (err) {}
  };

  return (
    <Switch>
      <Match when={caregivers.loading}>
        <Loader />
      </Match>
      <Match when={caregivers.error}>
        <Message className="mt-4" type="error">
          There was an error
        </Message>
      </Match>
      <Match when={caregivers().data && caregivers().data.length === 0}>
        <Message className="mt-4">{t("mentor.noCaregiversAssigned")}</Message>
      </Match>
      <Match when={caregivers().data && caregivers().data.length > 0}>
        <Table className="my-8">
          <Table.Header>
            <Table.Row>
              <Table.Th class="pr-0"></Table.Th>
              <Table.Th>{t("firstName")}</Table.Th>
              <Table.Th>{t("lastName")}</Table.Th>
              <Table.Th>{t("email")}</Table.Th>
              <Table.Th>{t("phoneNumber")}</Table.Th>
              <Table.Th></Table.Th>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <For each={caregivers().data}>
              {(caregiver: any) => (
                <Table.Row
                  class="cursor-pointer"
                  onClick={() => redirect(caregiver.caregiver_id)}
                >
                  <Table.Td class="pr-0">
                    <Avatar imageURL={caregiver.user.avatar_url} />
                  </Table.Td>
                  <Table.Td>{caregiver.first_name}</Table.Td>
                  <Table.Td>{caregiver.last_name}</Table.Td>
                  <Table.Td>{caregiver.user.email}</Table.Td>
                  <Table.Td>{caregiver.phone_number}</Table.Td>
                  <Table.Td>
                    <Button
                      className="ml-auto"
                      onClick={(e) => handleUnassign(e, caregiver.caregiver_id)}
                    >
                      {t("unassign")}
                    </Button>
                  </Table.Td>
                </Table.Row>
              )}
            </For>
          </Table.Body>
        </Table>
      </Match>
    </Switch>
  );
};

const AssignCaregiver: Component<{ mentorId: string }> = ({ mentorId }) => {
  const [t] = useI18n();
  // go to Patients for generics types
  const [params, setParams] = createStore({ type: "all", search: "" });
  const [data, { refetch }] = createResource<any, any>(
    getParams,
    getAssignableCaregivers
  );
  const [selected, setSelected] = createSignal<any>([]);

  function getParams() {
    return {
      id: mentorId,
      ...params,
      skip: 0,
      take: 10,
    };
  }

  createEffect(() => {
    console.log(data());
    console.log(params.type);
  });

  const handleCheck = (caregiver: any, checked: boolean) => {
    if (checked) {
      setSelected([...selected(), caregiver]);
    } else {
      setSelected(
        selected().filter((c: any) => c.caregiver_id !== caregiver.caregiver_id)
      );
    }
  };

  const [setSearch, clear] = createDebounce(
    (search) => setParams("search", search as string),
    500
  );
  const handleAssign = async () => {
    try {
      await assignCaregivers(
        mentorId,
        selected().map((caregiver: any) => caregiver.caregiver_id)
      );
      toast({ text: "Success" });
      refetch();
    } catch (err) {}
  };

  const deselectAll = () => {
    setSelected([]);
  };

  return (
    <>
      <div className="flex justify-end items-center my-6 gap-3">
        <h1 className="text-gray-700 mr-auto text-xl">{t("sidebar.caregivers")}</h1>
        <InlineSelect
          onSelect={(type) => setParams("type", type)}
          options={[
            { content: t("mentor.all"), value: "all" },
            { content: t("mentor.unassigned"), value: "unassigned" },
          ]}
        />
        <Input
          icon="search"
          version="secondary"
          className="max-w-xs"
          placeholder="Search for a caregiver"
          onInput={(e) => setSearch(e.currentTarget.value)}
        />
        <Button
          action="secondary"
          onClick={deselectAll}
          disabled={selected().length === 0}
        >
          {t("clear")}
        </Button>
        <Button onClick={handleAssign} disabled={selected().length === 0}>
          {t("assign")}
        </Button>
      </div>

      <Show when={!data.loading && data()} fallback={<Loader />}>
        {data()!.caregivers.length === 0 ? (
          <Message>No results</Message>
        ) : (
          <Table className="mt-3 mb-9">
            <Table.Header>
              <Table.Row>
                <Table.Th class="pr-0"></Table.Th>
                <Table.Th>{t("email")}</Table.Th>
                <Table.Th>{t("firstName")}</Table.Th>
                <Table.Th>{t("lastName")}</Table.Th>
                <Table.Th>{t("phoneNumber")}</Table.Th>
                <Table.Th></Table.Th>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <For each={data()!.caregivers}>
                {(caregiver: any) => (
                  <Table.Row>
                    <Table.Td class="pr-0">
                      <Avatar imageURL={caregiver.user.avatar_url} />
                    </Table.Td>
                    <Table.Td>{caregiver.user.email}</Table.Td>
                    <Table.Td>{caregiver.first_name}</Table.Td>
                    <Table.Td>{caregiver.last_name}</Table.Td>
                    <Table.Td>
                      <a href={`tel:${caregiver.phone_number}`}>
                        {caregiver.phone_number}
                      </a>
                    </Table.Td>
                    <Table.Td>
                      <Checkbox
                        onInput={(e) => handleCheck(caregiver, e.currentTarget.checked)}
                      />
                    </Table.Td>
                  </Table.Row>
                )}
              </For>
            </Table.Body>
          </Table>
        )}
      </Show>
    </>
  );
};

const Mentor: Component = () => {
  const params = useParams();
  // fetch mentor based on the id path parameter
  const [mentor, { mutate, refetch }] = createResource(() => params.id, getMentor);
  const [t] = useI18n();

  const updateMentor = (data: any) => {
    refetch();
  };

  return (
    <MainWrapper>
      <Show when={!mentor.loading} fallback={<Loader />}>
        <div className="flex mt-8 mb-11 gap-9 items-center">
          <Avatar imageURL={mentor()!.data.user.avatar_url} size="w-20 h-20" />
          <div>
            <h1 className="text-2xl text-gray-700">
              {mentor()!.data.user.display_name ||
                `${mentor()!.data.first_name} ${mentor()!.data.last_name}`}
            </h1>
            <div class="uppercase">{t("mentor.mentor")}</div>
          </div>
        </div>
        <Tabs
          panes={[
            {
              title: t("mentor.accountInfo"),
              route: "/account",
              element: () => (
                <AccountInfo mentor={mentor()!.data} refetchMentor={updateMentor} />
              ),
            },
            {
              title: t("mentor.caregivers"),
              route: "/caregivers",
              element: () => <MentorCaregivers />,
            },
            {
              title: t("mentor.assignCaregiver"),
              route: "/assign-caregiver",
              element: () => <AssignCaregiver mentorId={params.id} />,
            },
          ]}
        />
      </Show>
    </MainWrapper>
  );
};

export default Mentor;
