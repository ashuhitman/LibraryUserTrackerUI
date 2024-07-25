import React, { useEffect, useState } from "react";
import "./Alert.css";
import { FaXmark } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { BiSolidError } from "react-icons/bi";

function Alert({ alert, onClose }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (alert.show) {
      // Add the 'hide' class after 1000ms
      const addHideClassTimeout = setTimeout(() => {
        setHide(true);
        onClose();

        // Remove the 'hide' class after another 1000ms
        const removeHideClassTimeout = setTimeout(() => {
          setHide(false);
        }, 500);

        // Cleanup the second timeout
        return () => clearTimeout(removeHideClassTimeout);
      }, 1300);

      // Cleanup the first timeout
      return () => clearTimeout(addHideClassTimeout);
    }
  }, [alert, onClose]);

  return (
    <div
      id="alert"
      className={`alert ${alert.show ? "show" : ""} ${hide ? "hide" : ""} ${
        alert.anchor
      }`}
    >
      <span className="alert-icon">
        {alert.anchor === "success" && <FaCheckCircle />}
        {alert.anchor === "error" && <MdError />}
        {alert.anchor === "warning" && <BiSolidError />}
      </span>
      <p id="alertMessage">{alert.message}</p>
      <span id="cancel-alert">
        <FaXmark />
      </span>
    </div>
  );
}

export default Alert;
