import { Component, createResource, For, JSX, Show } from "solid-js";
import createDebounce from "@solid-primitives/debounce";
import { getMentors, QueryParams, Response } from "../../http/mentors";
import { Loader } from "../common/Loader/Loader";
import { createStore } from "solid-js/store";
import { Button } from "../common/Button/Button";
import { useI18n } from "@amoutonbrady/solid-i18n";
import { Table } from "../common/Table/Table";
import { Avatar } from "../common/Avatar";
import { Icon } from "../common/Icon";

type SelectMentorProps = JSX.IntrinsicElements["div"] & {
  setMentor: (mentor: Mentor) => void;
  mentorID: number;
  setStep: (step: number) => void;
  caregiver: any;
};

export const SelectMentor: Component<SelectMentorProps> = ({
  mentorID,
  setMentor,
  setStep,
  caregiver,
  ...rest
}) => {
  const [t] = useI18n();
  const [params, setParams] = createStore({ page: 1, search: "" });
  const [data, { refetch }] = createResource<Response, QueryParams>(
    () => ({ ...params }),
    getMentors
  );
  const [setSearch, cancel] = createDebounce(
    (search) => setParams("search", search as string),
    500
  );

  return (
    <div {...rest}>
      <input
        onInput={(e) => setSearch(e.currentTarget.value)}
        placeholder="Search for a mentor"
        className="py-3 px-4 border border-gray-300 rounded-md w-full shadow-md outline-none focus:bg-slate-50"
        autofocus
      />
      <Show when={data() && !data.loading} fallback={<Loader />}>
        <Table class="mt-5">
          <Table.Body>
            <For each={data()!.data.mentors}>
              {(mentor) => (
                <tr
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => setMentor(mentor)}
                  classList={{
                    "bg-gray-200": mentor.mentor_id === mentorID,
                  }}
                >
                  <td className="py-2">
                    <Avatar imageURL={mentor.user.avatar_url} />
                  </td>
                  <td className="py-2">{mentor.first_name}</td>
                  <td className="py-2">{mentor.last_name}</td>
                  <td className="py-2">{mentor.user.email}</td>
                  <td class="pr-0">
                    {mentor.mentor_id === mentorID && (
                      <Icon name="check_circle" size="text-3xl" />
                    )}
                  </td>
                </tr>
              )}
            </For>
          </Table.Body>
        </Table>

        <div class="flex gap-3 justify-end mt-8 mb-12">
          <Button onClick={() => setStep(2)} action="secondary">
            {t("back")}
          </Button>
          <Button onClick={() => setStep(4)} action="secondary">
            {t("skip")}
          </Button>
          <Button onClick={() => setStep(4)} disabled={caregiver.mentor_id === -1}>
            {t("continue")}
          </Button>
        </div>
      </Show>
    </div>
  );
};
