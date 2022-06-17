import { Component, For, JSX } from "solid-js";
import { Icon } from "../Icon";
import "./Steps.css";

type StepProps = JSX.IntrinsicElements["div"] & {
  state: "active" | "done" | "incomplete";
};

const Step: Component<StepProps> = ({ state, ...rest }) => {
  return (
    <div class={`step ${state}`} {...rest}>
      {state === "done" && <Icon name="check" />}
    </div>
  );
};

type StepsProps = JSX.IntrinsicElements["div"] & {
  steps: { text?: string }[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  completedSteps: number[];
};

export const Steps: Component<StepsProps> = ({
  steps,
  activeStep,
  setActiveStep,
  completedSteps,
  ...rest
}) => {
  const handleStepClick = () => {};
  const isCompleted = (step: number) => step < activeStep; // completedSteps.includes(step);

  const getState = (step: number) =>
    activeStep - 1 === step ? "active" : isCompleted(step) ? "done" : "incomplete";

  return (
    <div class="flex gap-5" {...rest}>
      <For each={steps}>
        {(step, i) => <Step state={getState(i())} onClick={handleStepClick} />}
      </For>
    </div>
  );
};
