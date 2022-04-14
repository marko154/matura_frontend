import { useParams } from "solid-app-router";
import { Component, createEffect, createResource, For } from "solid-js";
import { getAvailibility } from "../../http/caregivers";
import { getDay, toTimeInputValue } from "../../utils/date.utils";
import { formatDate } from "../../utils/strings.utils";
import {
  AccordionButton,
  AccordionContent,
  AccordionItem,
  createAccordion,
} from "../common/Accordion/Accordion";
import { Icon } from "../common/Icon";
import { Input } from "../common/Input/Input";
import { Loader } from "../common/Loader/Loader";
import { Message } from "../common/Message/Message";

export const Availibility: Component = () => {
  const params = useParams();
  const [terms, { refetch }] = createResource(() => params.id, getAvailibility);
  const { handleItemClick, openIndexes } = createAccordion({ initialState: [0] });

  createEffect(() => {
    console.log(openIndexes());
  });

  return (
    <div>
      {terms.loading ? (
        <Loader />
      ) : terms.error ? (
        <Message className="mt-4">An error has occured</Message>
      ) : terms()!.length === 0 ? (
        <Message className="mt-4">
          This caregiver doesn't have any availibilities yet.
        </Message>
      ) : (
        <div class="mt-3">
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
                    <For each={term.Availibility}>
                      {(availibility) => (
                        <div>
                          <div class="my-2 font-bold">
                            {getDay(availibility.day_of_week)}
                          </div>
                          <div class="flex gap-3">
                            <Input
                              type="time"
                              value={toTimeInputValue(availibility.start_time)}
                              label="From"
                              version="secondary"
                              className="w-40"
                            />
                            <Input
                              type="time"
                              value={toTimeInputValue(availibility.end_time)}
                              label="To"
                              version="secondary"
                              className="w-40"
                            />
                          </div>
                        </div>
                      )}
                    </For>
                  </AccordionContent>
                </AccordionItem>
              );
            }}
          </For>
        </div>
      )}
    </div>
  );
};
