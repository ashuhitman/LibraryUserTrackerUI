import React, { useState, useEffect } from "react";

const DateTime = () => {
  const [dateTime, setDateTime] = useState("");

  const updateDateTime = () => {
    const now = new Date();
    const datetimeStr = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setDateTime(datetimeStr);
  };

  useEffect(() => {
    updateDateTime(); // Initial call to set the date and time immediately
    const intervalId = setInterval(updateDateTime, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return <span id="datetime">{dateTime}</span>;
};

export default DateTime;
