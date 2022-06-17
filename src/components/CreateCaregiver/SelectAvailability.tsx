import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate } from "solid-app-router";
import { Component, createSignal, For, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { DAYS } from "../../constants/datetime.constants";
import { createCaregiver } from "../../http/caregivers";
import { getDay, toDateInputValue } from "../../utils/date.utils";
import { formatDate } from "../../utils/strings.utils";
import { Button } from "../common/Button/Button";
import { Checkbox } from "../common/Checkbox";
import { Input } from "../common/Input/Input";
import { Radio } from "../common/Radio/Radio";
import { Select } from "../common/Select/Select";
import { toast } from "../common/Toast/Toast";

export type AvailibilityFields = {
  start_date: string;
  end_date: null | string;
  repeats: number;
  days: {
    times: { from: string | null; to: string | null }[];
  }[];
};

export const AddAvailibility: Component<{ add: (af: AvailibilityFields) => void }> = ({
  add,
}) => {
  const [t] = useI18n();
  const [state, setState] = createStore<AvailibilityFields>({
    start_date: toDateInputValue(new Date()),
    end_date: null,
    repeats: 7,
    days: DAYS.map(() => ({ times: [] })),
  });

  const handleChangeDay = (dayIdx: number) => {
    if (state.days[dayIdx].times.length === 0) {
      setState("days", dayIdx, "times", [{ from: null, to: null }]);
    } else {
      setState("days", dayIdx, "times", []);
    }
  };

  const handleTimeChange = (
    time: string,
    dayIdx: number,
    timeIdx: number,
    ft: "from" | "to"
  ) => {
    setState("days", dayIdx, "times", timeIdx, ft, time);
  };

  const canAdd = () => {
    return (
      state.start_date,
      state.days.some((day) => day.times.length > 0) &&
        state.days.every((day) => day.times.every((time) => time.from && time.to))
    );
  };

  const handleAddAvailibility = () => {
    console.log(JSON.parse(JSON.stringify(state)));
    add(JSON.parse(JSON.stringify(state)));
    setState({
      start_date: toDateInputValue(new Date()),
      end_date: null,
      repeats: 7,
      days: DAYS.map(() => ({ times: [] })),
    });
  };

  return (
    <section class="rounded border w-fit py-7 px-8 text-gray-700">
      <h2 class="text-xl mt-2 mb-4">New Availibility</h2>
      <div class="grid max-w-lg" style="grid-template-columns: 10rem 1fr; gap: 1rem;">
        <div class="text-right px-3 py-2">Repeats: </div>
        <div class="flex items-center">
          <Select
            options={[
              { text: "Weekly", val: 7 },
              { text: "Monthly", val: 30 },
            ]}
            defaultValue="Weekly"
            onChange={() => {}}
          />
        </div>
        <div class="text-right px-3 py-2">Repeats on: </div>
        <div class="flex gap-4">
          <For each={state.days}>
            {(day, di) => (
              <div class="text-center">
                <div>{DAYS[di()]}</div>
                <Checkbox
                  onClick={() => handleChangeDay(di())}
                  checked={day.times.length > 0}
                />
              </div>
            )}
          </For>
        </div>

        <div class="text-right px-3 py-2">Starts on: </div>
        <div>
          <Input
            type="date"
            version="secondary"
            name="start_date"
            value={state.start_date}
            onInput={(e) => setState("start_date", e.currentTarget.value)}
          />
        </div>
        <div class="text-right px-3 py-2">Ends: </div>
        <div class="flex flex-col gap-2">
          <Radio
            label="Never"
            name="end_date"
            value={null}
            setValue={(val) => setState("end_date", val)}
            checked={state.end_date === null}
          />
          <Radio
            label={
              <>
                On
                <Input
                  type="date"
                  version="secondary"
                  className="ml-4"
                  onInput={(e) => setState("end_date", e.currentTarget.value)}
                />
              </>
            }
            checked={state.end_date !== null}
            name="end_date"
            value={"test2"}
          />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <For each={state.days}>
          {(day, di) =>
            day.times && (
              <For each={day.times}>
                {({ from, to }, i) => (
                  <div>
                    <div>{getDay(di())}</div>
                    <div class="flex gap-2">
                      <Input
                        type="time"
                        version="secondary"
                        value={from || ""}
                        onInput={(e) =>
                          handleTimeChange(e.currentTarget.value, di(), i(), "from")
                        }
                      />
                      <Input
                        type="time"
                        version="secondary"
                        value={to || ""}
                        onInput={(e) =>
                          handleTimeChange(e.currentTarget.value, di(), i(), "to")
                        }
                      />
                    </div>
                  </div>
                )}
              </For>
            )
          }
        </For>
      </div>
      <Button
        onClick={handleAddAvailibility}
        className="ml-auto mt-5"
        disabled={!canAdd()}
      >
        {t("add")}
      </Button>
    </section>
  );
};

const Availibilities: Component<{ availibilities: AvailibilityFields[] }> = ({
  availibilities,
}) => {
  return (
    <div class="flex flex-col gap-4">
      <For each={availibilities}>
        {({ days, end_date, repeats, start_date }) => (
          <div class="border border-gray-200 rounded-md text-gray-700 pb-4">
            <div class="flex justify-between gap-3 text-lg bg-gray-100 py-4 px-9 font-bold">
              <div>STARTS: {formatDate(start_date)}</div>
              <div>ENDS: {end_date ? formatDate(end_date) : "Never"}</div>
              {/* <div>Repeats: {repeats}</div> */}
            </div>
            <div class="px-10 py-2 max-h-40 overflow-auto">
              <For each={days}>
                {(day, di) => (
                  <div>
                    {day.times.length > 0 && (
                      <div class="pt-2 text-center">{getDay(di())}</div>
                    )}
                    <For each={day.times}>
                      {({ from, to }) => (
                        <div class="flex gap-3">
                          <Input
                            type="time"
                            value={from!}
                            label="From"
                            disabled
                            version="secondary"
                            className="w-40"
                          />
                          <Input
                            type="time"
                            value={to!}
                            label="To"
                            disabled
                            version="secondary"
                            className="w-40"
                          />
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

type SelectAvailibilityProps = JSX.IntrinsicElements["div"] & {
  setStep: (step: number) => void;
  caregiver: any;
  addAvailibility: (a: AvailibilityFields) => void;
};

export const SelectAvailibility: Component<SelectAvailibilityProps> = ({
  setStep,
  caregiver,
  addAvailibility,
}) => {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(caregiver);
      const res = await createCaregiver(caregiver);
      console.log(res);
      toast({ text: "Caregiver successfully created" });
      navigate(`/caregiver/${res.caregiver_id}`, { replace: true });
    } catch (err) {
      console.log(err);
      toast({ text: "Something went wrong" });
    }
    setLoading(false);
  };

  return (
    <div>
      <div class="flex gap-3 justify-end mt-5">
        <Button onClick={() => setStep(3)} action="secondary">
          {t("back")}
        </Button>
        <Button onClick={handleSubmit} disabled={loading()} loading={loading()}>
          {t("create")}
        </Button>
      </div>
      <div class="flex justify-center mt-8 gap-10">
        <AddAvailibility add={addAvailibility} />
        <Availibilities availibilities={caregiver.availibilities} />
      </div>
    </div>
  );
};
