import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Model.css";
import { useDispatch } from "react-redux";
import { fetchReports } from "../../redux/reportsSlice";

function Model({ show, onClose }) {
  const [maxDate, setMaxDate] = useState("");
  const startRef = useRef(null);
  const endRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMaxDate(today);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    // get start date
    const start = startRef.current.value;
    // get end date
    const end = endRef.current.value;

    const query = `startDate=${start}&endDate=${end}`;

    // navigate to same page
    navigate(`/reports?${query}`);
    onClose();
  };
  return (
    <div className={`model ${show ? "showModel" : ""}`}>
      <div className="model-head">
        <h3>Get reports by Date</h3>
      </div>
      <div className="model-content">
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="">Start Date: </label>
            <input type="date" ref={startRef} required />
          </div>
          <div className="form-group">
            <label htmlFor="">End Date: </label>
            <input
              type="date"
              ref={endRef}
              max={maxDate}
              defaultValue={maxDate}
            />
          </div>
          <div className="form-group">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Model;
