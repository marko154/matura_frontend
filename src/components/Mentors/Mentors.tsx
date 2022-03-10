import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate } from "solid-app-router";
import { Component, createResource, createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { deleteMentor, getMentors, Response, QueryParams } from "../../http/mentors";
import { formatDate } from "../../utils/strings.utils";
import { Button } from "../common/Button/Button";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";
import { Modal } from "../common/Modal/Modal";
import { Pagination } from "../common/Pagination";
import { Table } from "../common/Table/Table";
import createDebounce from "@solid-primitives/debounce";
import { Input } from "../common/Input/Input";
import { SearchedText } from "../common/SearchedText";
import { Icon } from "../common/Icon";

const Mentors: Component = () => {
  const [t] = useI18n();
  const [userDeleteId, setUserDeleteId] = createSignal<number | null>(null);
  const [params, setParams] = createStore({ page: 1, search: "" });
  const [data, { refetch }] = createResource<Response, QueryParams>(
    () => ({ ...params }),
    getMentors
  );
  const navigate = useNavigate();

  const redirectCreate = () => {
    navigate("/mentor/create");
  };

  const redirect = (mentorId: number) => {
    navigate(`/mentor/${mentorId}`);
  };

  const [setSearch, clear] = createDebounce(
    (search) => setParams("search", search as string),
    500
  );

  const handleDeleteClick = (e: any, userId: number) => {
    e.stopPropagation();
    setUserDeleteId(userId);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteMentor(userDeleteId()!.toString());
      refetch(); // change this to a mutation for performance
    } catch (err) {
      console.log(err);
    }
    setUserDeleteId(null);
  };

  return (
    <MainWrapper title={t("sidebar.mentors")}>
      <div className="flex justify-between">
        <Input
          className="w-80"
          version="secondary"
          placeholder={t("searchBy")}
          onInput={(e) => setSearch(e.currentTarget.value)}
          icon="search"
          autofocus
        />
        <Button className="ml-auto block" onClick={redirectCreate}>
          {t("mentor.createMentor")}
        </Button>
      </div>

      <Show when={data() && !data.loading} fallback={<Loader />}>
        <Table className="mt-3">
          <Table.Header>
            <Table.Row>
              <Table.Th>ID</Table.Th>
              <Table.Th>{t("email")}</Table.Th>
              <Table.Th>{t("firstName")}</Table.Th>
              <Table.Th>{t("lastName")}</Table.Th>
              <Table.Th>{t("gender")}</Table.Th>
              <Table.Th>{t("phoneNumber")}</Table.Th>
              <Table.Th>{t("dateOfBirth")}</Table.Th>
              <Table.Th></Table.Th>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <For each={data()!.mentors}>
              {(mentor) => (
                <Table.Row
                  class="cursor-pointer"
                  onClick={() => redirect(mentor.mentor_id!)}
                >
                  <Table.Td>{mentor.mentor_id}</Table.Td>
                  <Table.Td>
                    <SearchedText search={params.search} text={mentor.user.email} />
                  </Table.Td>
                  <Table.Td>
                    <SearchedText search={params.search} text={mentor.first_name} />
                  </Table.Td>
                  <Table.Td>
                    <SearchedText search={params.search} text={mentor.last_name} />
                  </Table.Td>
                  <Table.Td>{mentor.gender}</Table.Td>
                  <Table.Td>
                    <a href={`tel:${mentor.phone_number}`}>{mentor.phone_number}</a>
                  </Table.Td>
                  <Table.Td>{formatDate(mentor.date_of_birth)}</Table.Td>
                  <Table.Td>
                    <Button
                      className="w-10 h-10 !p-0"
                      onClick={(e) => handleDeleteClick(e, mentor.user.user_id)}
                    >
                      <Icon name="delete_outline" size="text-xl" />
                    </Button>
                  </Table.Td>
                </Table.Row>
              )}
            </For>
          </Table.Body>
        </Table>
        <Pagination
          totalPages={Math.ceil(data()!.total / 10)}
          activePage={params.page}
          onPageChange={(page) => setParams("page", page)}
          className="mx-auto py-10"
        />
        <Modal open={userDeleteId() !== null}>
          <h2 className="mb-8 text-lg">{t("confirmationNote")}</h2>
          <div className="flex justify-end gap-2">
            <Button action="secondary" onClick={() => setUserDeleteId(null)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleDeleteUser}>{t("confirm")}</Button>
          </div>
        </Modal>
      </Show>
    </MainWrapper>
  );
};

export default Mentors;
