import { createPortal } from "react-dom";

// onBackdropClick is optional: without it the backdrop stays inert, which
// is what the contact and RSVP forms rely on.
const Modal = ({ children, onBackdropClick }) => {
  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="modal-backdrop"
            aria-hidden="true"
            onClick={onBackdropClick}
          />
          {children}
        </div>,
        document.body,
      )}
    </>
  );
};

export default Modal;
