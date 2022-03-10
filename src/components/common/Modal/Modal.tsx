import { Component } from "solid-js";
import { Portal } from "solid-js/web";
import "./Modal.css";

type ModalProps = {
  open: boolean;
  onClose?: () => void;
};

export const Modal: Component<ModalProps> = ({ open, onClose = () => {}, children }) => {
  const handleBackgroundClick = (e: any) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <Portal>
      <div
        class="modal background"
        classList={{ open }}
        onClick={handleBackgroundClick}
      ></div>
      <div className="modal-container z-20" classList={{ open }}>
        <div className="p-8">{children}</div>
      </div>
    </Portal>
  );
};
