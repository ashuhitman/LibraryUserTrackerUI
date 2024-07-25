// AlertContext.js
import React, { createContext, useContext, useState } from "react";
import Alert from "../components/Alert/Alert";

// Create the Alert Context
const AlertContext = createContext();

// Custom hook to use the Alert Context
export const useAlert = () => {
  return useContext(AlertContext);
};

// AlertProvider component to wrap the application or component subtree
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    anchor: "success",
  });

  const showAlert = (message, anchor) => {
    setAlert({ message, anchor, show: true });
  };

  const hideAlert = () => {
    setAlert((prevState) => ({ ...prevState, show: false }));
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      <Alert alert={alert} onClose={hideAlert} />
      {children}
    </AlertContext.Provider>
  );
};
