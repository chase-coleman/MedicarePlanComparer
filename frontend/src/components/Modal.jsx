import { createPortal } from "react-dom";

const Modal = ({ children }) => {
  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="modal-backdrop" aria-hidden="true" />
          {children}
        </div>,
        document.body,
      )}
    </>
  );
};

export default Modal;
