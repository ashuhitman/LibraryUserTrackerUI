import React, { useEffect, useRef } from "react";
import styles from "./Settings.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLibraryInfo,
  updateLibraryInfo,
} from "../../redux/libraryInfoSlice";
import { useAlert } from "../../context/AlertContext";

function Settings() {
  // Create refs for each input field
  const collegeNameRef = useRef(null);
  const libraryNameRef = useRef(null);
  const availableSeatsRef = useRef(null);
  const dispatch = useDispatch();
  const { show, showAlert } = useAlert();
  console.log("alert, show", show);

  const { data, status } = useSelector((state) => state.libraryInfo);
  useEffect(() => {
    window.title = "Settings";
  }, []);

  useEffect(() => {
    // Fetch library info only if not already fetched
    if (status === "idle") {
      dispatch(fetchLibraryInfo());
    } else if (status === "failed") {
      showAlert("Library info update failed", "error");
    } else if (status === "updated") {
      showAlert("Library info updated successfully", "success");
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      console.log("Data loaded from Redux:", data);
      // Set initial values from Redux state
      if (collegeNameRef.current)
        collegeNameRef.current.value = data.institution_name || "";
      if (libraryNameRef.current)
        libraryNameRef.current.value = data.library_name || "";
      if (availableSeatsRef.current)
        availableSeatsRef.current.value = data.total_seats || "";
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Access the values using the refs
    const collegeName = collegeNameRef.current.value;
    const libraryName = libraryNameRef.current.value;
    const availableSeats = availableSeatsRef.current.value;
    console.log("College Name:", collegeName);
    console.log("Library Name:", libraryName);
    console.log("Available Seats:", availableSeats);
    // update the library information
    dispatch(
      updateLibraryInfo({
        ...data,
        institution_name: collegeName,
        library_name: libraryName,
        total_seats: availableSeats,
      })
    );
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label>College Name: </label>
          <input type="text" className="form-control" ref={collegeNameRef} />
        </div>
        <div className={styles["form-group"]}>
          <label>Library Name: </label>
          <input type="text" className="form-control" ref={libraryNameRef} />
        </div>
        <div className={styles["form-group"]}>
          <label>Total seats: </label>
          <input
            type="number"
            className="form-control"
            ref={availableSeatsRef}
          />
        </div>
        <div className={styles["form-group"]}>
          <button type="submit" className="btn">
            {status === "loading" ? "Updating..." : "Update"}
          </button>
        </div>
        <div className={styles.link}>
          <Link to="/home">Go to Home</Link>
        </div>
      </form>
    </div>
  );
}

export default Settings;
