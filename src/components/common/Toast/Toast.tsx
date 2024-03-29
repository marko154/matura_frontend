import { Component, createSignal, For, Index } from "solid-js";
import { createStore } from "solid-js/store";
import { TransitionGroup } from "solid-transition-group";
import { generateUniqueID } from "../../../utils/uniqueID.utils";
import "./Toast.css";

type Message = {
  text: string;
  id: string;
};

let parent!: HTMLElement;
const [state, setState] = createStore<{ messages: Message[] }>({
  messages: [],
});

let toast = function (newMessage: { text: string }) {
  try {
    const id = generateUniqueID();
    const first = parent.offsetHeight;

    setState("messages", [...state.messages, { text: newMessage.text, id }]);

    const last = parent.offsetHeight;
    const invert = last - first;
    const animation = parent.animate(
      [{ transform: `translateY(${invert}px)` }, { transform: "translateY(0)" }],
      {
        duration: 150,
        easing: "ease-out",
      }
    );

    setTimeout(() => {
      setState(
        "messages",
        state.messages.filter((message) => message.id !== id)
      );
    }, 5000);
  } catch (err) {}
};
export const ToastContainer: Component = () => {
  return (
    <section className="toast-container" ref={parent}>
      <TransitionGroup name="toast-message">
        <For each={state.messages}>
          {(message) => (
            <output role="status" className="toast-message">
              {message.text}
            </output>
          )}
        </For>
      </TransitionGroup>
    </section>
  );
};

export { toast };
