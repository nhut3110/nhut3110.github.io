import React from "react";
import "./ConfirmDialog.css";

export const ConfirmDialog = ({ onClose, visible, handleDelete }) => {
  const handleOnClose = (e) => {
    if (e.target.id === "NewList") {
      onClose();
    }
  };
  if (!visible) return null;
  return (
    <div
      className="modal__ConfirmDialog"
      id="ConfirmDialog"
      onClick={handleOnClose}
    >
      <div className="modal__ConfirmDialog-box">
        <div className="modal__ConfirmDialog-header">
          <h1> Do you want to delete this?</h1>
          <p className="btn__close" onClick={onClose} type="">
            x
          </p>
        </div>

        <button className="btn__confirm-no" onClick={onClose}>
          No
        </button>
        <button className="btn__confirm-yes" onClick={handleDelete}>
          Yes
        </button>
      </div>
    </div>
  );
};
