import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import { useI18n } from "@amoutonbrady/solid-i18n";
import { MainWrapper } from "../common/MainWrapper";
import { CaregiversMap } from "./CaregiversMap";
import { deleteCaregiver, getCaregivers } from "../../http/caregivers";
import { Button } from "../common/Button/Button";
import { useNavigate } from "solid-app-router";
import { Loader } from "../common/Loader/Loader";
import { Table } from "../common/Table/Table";
import { formatDate } from "../../utils/strings.utils";
import { Modal } from "../common/Modal/Modal";
import { Pagination } from "../common/Pagination";
import { Icon } from "../common/Icon";
import { createStore } from "solid-js/store";
import { Input } from "../common/Input/Input";

const CaregiverRow: Component<{ caregiver: any; refetch: () => void }> = ({
  caregiver,
  refetch,
}) => {
  const navigate = useNavigate();
  const [userDeleteId, setUserDeleteId] = createSignal<number | null>(null);
  const [t] = useI18n();

  const [state, setState] = createStore({
    editing: false,
    phone_number: caregiver.phone_number,
  });

  const redirect = (caregiverId: number) => {
    if (state.editing) return;
    navigate(`/caregiver/${caregiverId}`);
  };
  const handleDeleteClick = (e: any) => {
    e.stopPropagation();
    setUserDeleteId(caregiver.user.user_id);
  };
  const handleDeleteUser = async () => {
    try {
      await deleteCaregiver(userDeleteId()!.toString());
      refetch(); // change this to a mutation for performance
    } catch (err) {
      console.log(err);
    }
    setUserDeleteId(null);
  };

  const handleEditClick = (e: any) => {
    e.stopPropagation();
    setState("editing", !state.editing);
  };

  const handleChange = (e: any) => {
    setState(e.currentTarget.name, e.currentTarget.value);
  };

  return (
    <>
      <Table.Row class="cursor-pointer" onClick={() => redirect(caregiver.caregiver_id)}>
        <Table.Td>{caregiver.user.user_id}</Table.Td>
        <Table.Td>{caregiver.user.email}</Table.Td>
        <Table.Td>{caregiver.first_name}</Table.Td>
        <Table.Td>{caregiver.last_name}</Table.Td>
        {/* <Table.Td>{caregiver.gender}</Table.Td> */}
        <Table.Td>
          {state.editing ? (
            <Input
              type="tel"
              name="phone_number"
              version="secondary"
              value={state.phone_number}
            />
          ) : (
            <a href={`tel:${caregiver.phone_number}`}>{caregiver.phone_number}</a>
          )}
        </Table.Td>
        <Table.Td>{formatDate(caregiver.date_of_birth)}</Table.Td>
        <Table.Td class="flex gap-1">
          <Button action="secondary" className="p-0 w-10 h-10" onClick={handleEditClick}>
            <Icon name={state.editing ? "close" : "edit"} size="text-xl" />
          </Button>
          <Button className="p-0 w-10 h-10" onClick={(e) => handleDeleteClick(e)}>
            <Icon name={state.editing ? "done" : "delete_outline"} size="text-xl" />
          </Button>
        </Table.Td>
      </Table.Row>
      <Modal open={userDeleteId() !== null}>
        <h2 className="mb-8 text-lg">{t("confirmationNote")}</h2>
        <div className="flex justify-end gap-2">
          <Button action="secondary" onClick={() => setUserDeleteId(null)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleDeleteUser}>{t("confirm")}</Button>
        </div>
      </Modal>
    </>
  );
};

const CaregiversTable: Component = ({}) => {
  const navigate = useNavigate();
  const [t] = useI18n();
  const [page, setPage] = createSignal(1);
  const [data, { refetch }] = createResource(page, getCaregivers);

  const redirectCreate = () => {
    navigate("/caregiver/create");
  };

  createEffect(() => console.log(data()));
  return (
    <>
      <Button className="ml-auto block" onClick={redirectCreate}>
        Create a Caregiver
      </Button>
      <Show when={data()} fallback={<Loader />}>
        <Table className="mt-3">
          <Table.Header>
            <Table.Row>
              <Table.Th>ID</Table.Th>
              <Table.Th>{t("email")}</Table.Th>
              <Table.Th>{t("firstName")}</Table.Th>
              <Table.Th>{t("lastName")}</Table.Th>
              {/* <Table.Th>{t("gender")}</Table.Th> */}
              <Table.Th>{t("phoneNumber")}</Table.Th>
              <Table.Th>{t("dateOfBirth")}</Table.Th>
              <Table.Th></Table.Th>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <For each={data()!.caregivers}>
              {(caregiver: any) => (
                <CaregiverRow caregiver={caregiver} refetch={refetch} />
              )}
            </For>
          </Table.Body>
        </Table>

        <Pagination
          className="mx-auto py-10"
          totalPages={Math.ceil(data()!.total / 10)}
          activePage={page()}
          onPageChange={setPage}
        />
      </Show>
    </>
  );
};

const Caregivers: Component = () => {
  const [t] = useI18n();

  return (
    <MainWrapper title={t("sidebar.caregivers")}>
      {/* <CaregiversMap /> */}
      <CaregiversTable />
    </MainWrapper>
  );
};

export default Caregivers;
