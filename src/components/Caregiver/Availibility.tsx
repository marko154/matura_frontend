import { useI18n } from "@amoutonbrady/solid-i18n";
import { useParams } from "solid-app-router";
import { Component, createEffect, createResource, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import { DAYS, SHORT_DAYS } from "../../constants/datetime.constants";
import {
  createAvailibilities,
  createTermAvailibility,
  deleteAvailibility,
  getAvailibility,
} from "../../http/caregivers";
import { getDay, toTimeInputValue } from "../../utils/date.utils";
import { formatDate } from "../../utils/strings.utils";
import {
  AccordionButton,
  AccordionContent,
  AccordionItem,
  createAccordion,
} from "../common/Accordion/Accordion";
import { Button } from "../common/Button/Button";
import { Icon } from "../common/Icon";
import { Input } from "../common/Input/Input";
import { Loader } from "../common/Loader/Loader";
import { Message } from "../common/Message/Message";
import { Radio } from "../common/Radio/Radio";
import { toast } from "../common/Toast/Toast";
import {
  AddAvailibility,
  AvailibilityFields,
} from "../CreateCaregiver/SelectAvailability";

export const Availibility: Component = () => {
  const params = useParams();
  const [t] = useI18n();
  const [terms, { refetch }] = createResource(() => params.id, getAvailibility);
  const { handleItemClick, openIndexes } = createAccordion({ initialState: [0] });

  // new time range (from_time - to_time on a weekday) for a specific date range
  const [newTimeRange, setNewTimeRange] = createStore({
    day_of_week: 0,
    start_time: "",
    end_time: "",
  });

  const handleAddTimeRange = async (term_id: number) => {
    try {
      await createTermAvailibility({ term_id, caregiver_id: params.id, ...newTimeRange });
      refetch();
      toast({ text: "Successfully added" });
    } catch (err) {
      toast({ text: "There was an error" });
    }
  };

  const handleDeleteAvailibility = async (availibilty_id: number) => {
    try {
      await deleteAvailibility(availibilty_id);
      refetch();
      toast({ text: "Successfully deleted" });
    } catch (err) {
      toast({ text: "There was an error" });
    }
  };

  const handleCreateAvailibilities = async (availibilities: AvailibilityFields) => {
    try {
      await createAvailibilities(params.id, availibilities);
      refetch();
      toast({ text: "Successfully deleted" });
    } catch (err) {
      toast({ text: "There was an error" });
    }
  };

  createEffect(() => {
    console.log(openIndexes());
  });

  return (
    <div>
      {terms.loading ? (
        <Loader />
      ) : terms.error ? (
        <Message className="mt-4">An error has occured</Message>
      ) : (
        <div class="mt-6 flex justify-evenly">
          {terms()!.length > 0 && (
            <section style="max-width: 800px;">
              <For each={terms()}>
                {(term, idx) => {
                  const isOpen = () => openIndexes().includes(idx());

                  return (
                    <AccordionItem>
                      <AccordionButton onClick={() => handleItemClick(idx())}>
                        <div class="flex gap-1 items-center">
                          {formatDate(term.start_date)}
                          <Icon name="east" />
                          {term.end_date ? formatDate(term.end_date) : "Forever"}
                        </div>
                        <Icon
                          name="expand_more"
                          size="text-xl"
                          classList={{ "rotate-180": isOpen() }}
                        />
                      </AccordionButton>
                      <AccordionContent isOpen={isOpen()}>
                        <For
                          each={term.Availibility.sort(
                            (a, b) => a.day_of_week - b.day_of_week
                          )}
                        >
                          {(availibility) => (
                            <div>
                              <div class="my-2 font-bold">
                                {getDay(availibility.day_of_week)}
                              </div>
                              <div class="flex gap-3 items-center">
                                <Input
                                  type="time"
                                  value={toTimeInputValue(availibility.start_time)}
                                  label="From"
                                  version="secondary"
                                  className="w-40"
                                />
                                <Icon name="east" className="mt-5" />
                                <Input
                                  type="time"
                                  value={toTimeInputValue(availibility.end_time)}
                                  label="To"
                                  version="secondary"
                                  className="w-40"
                                />
                                <Button
                                  className="p-0 w-10 h-10 mt-6"
                                  onClick={(e) =>
                                    handleDeleteAvailibility(availibility.availibilty_id)
                                  }
                                >
                                  <Icon name="delete_outline" size="text-xl" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </For>
                        <div class="mt-14">
                          <div class="flex gap-3 items-center">
                            <select
                              class="input secondary w-20 mt-6 border-gray-300"
                              onChange={(e) =>
                                setNewTimeRange(
                                  "day_of_week",
                                  Number(e.currentTarget.value)
                                )
                              }
                            >
                              <For each={SHORT_DAYS}>
                                {(day, i) => <option value={i()}>{day}</option>}
                              </For>
                            </select>
                            <Input
                              type="time"
                              value={newTimeRange.start_time}
                              label="From"
                              version="secondary"
                              className="w-40"
                              onChange={(e) =>
                                setNewTimeRange("start_time", e.currentTarget.value)
                              }
                            />
                            <Icon name="east" className="mt-5" />
                            <Input
                              type="time"
                              value={newTimeRange.end_time}
                              label="To"
                              version="secondary"
                              className="w-40"
                              min={newTimeRange.start_time}
                              onChange={(e) =>
                                setNewTimeRange("end_time", e.currentTarget.value)
                              }
                            />
                            <Button
                              style="margin-top: 22px"
                              onClick={() => handleAddTimeRange(term.term_id)}
                              disabled={
                                !newTimeRange.end_time || !newTimeRange.start_time
                              }
                            >
                              {t("add")}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                }}
              </For>
            </section>
          )}

          <div>
            {terms()!.length === 0 && (
              <Message className="my-3">
                Add availibilility times for better recommendations
              </Message>
            )}
            <AddAvailibility add={handleCreateAvailibilities} />
          </div>
        </div>
      )}
    </div>
  );
};
