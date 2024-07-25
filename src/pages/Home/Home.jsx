// Home.js
import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import { FaCloudDownloadAlt } from "react-icons/fa";
import DateTime from "../../components/DateTime";
import { Link, useNavigate } from "react-router-dom";
import { MdSettings } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addReport, clearLatest, fetchSummary } from "../../redux/reportsSlice";
import { calculateDuration, convertTo12Hour } from "../../utils/utils";
import { fetchLibraryInfo } from "../../redux/libraryInfoSlice";

const Home = () => {
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [barcode, setBarcode] = useState("");

  const {
    data: reports,
    summary,
    addStatus,
    summaryStatus,
    latest,
    error,
  } = useSelector((state) => state.reports);
  const { status, data: library } = useSelector((state) => state.libraryInfo);

  const dispatch = useDispatch();

  const userStatusRef = useRef({
    status: "in",
    greeting: "Welcome to Central Library",
    para1: "Your barcode is  vkjjj434",
    para2: "Check in time - 5:48 AM",
  });

  useEffect(() => {
    document.title = "Home";
    if (status === "idle") {
      dispatch(fetchLibraryInfo());
    }
    if (summaryStatus === "idle") {
      dispatch(fetchSummary());
    }
  }, []);

  useEffect(() => {
    let timerid;
    if (isCheckedIn) {
      timerid = setTimeout(() => {
        setIsCheckedIn(false);
        dispatch(clearLatest()); // Clear the latest state after processing
      }, 3000);
    }
    return () => clearTimeout(timerid);
  }, [isCheckedIn]);

  useEffect(() => {
    console.log("running home useffect", addStatus, latest);
    if (Object.keys(latest).length === 0) return;
    if (addStatus === "succeeded") {
      setIsCheckedIn(true);
      if (latest.actionType) {
        userStatusRef.current.status = "out";
        userStatusRef.current.greeting = "Thank You!";
        userStatusRef.current.para1 = `Check out time: ${convertTo12Hour(
          latest.row.checkout
        )}`;
        userStatusRef.current.para2 = `Total time duration: ${calculateDuration(
          latest.row.checkin,
          latest.row.checkout
        )}`;
      } else {
        userStatusRef.current.status = "in";
        userStatusRef.current.greeting = "Welcome to Central Library";
        userStatusRef.current.para1 = `Your barcode is ${latest.row.barcode}`;
        userStatusRef.current.para2 = `Check in time: ${convertTo12Hour(
          latest.row.checkin
        )}`;
      }
      setBarcode("");
    }
  }, [addStatus, latest]);

  const handleCheckInOut = () => {
    dispatch(addReport({ barcode }));
  };

  const logout = () => navigate("/");
  const submit = (e) => {
    e.preventDefault();
    handleCheckInOut();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <DateTime />
        <Link to="/settings" className={styles.settings}>
          <MdSettings />
        </Link>
        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.downloadIcon}>
          <Link className={styles.reportsLink} to="/reports">
            <IoDocumentText />
          </Link>
          <label className={styles.tooltip}>See Reports</label>
        </div>
        <h1>Welcome to Central Library</h1>
        <h2>Visitor's Check-in/Check-out</h2>

        <form
          id={styles.checkInOutForm}
          onSubmit={submit}
          className={isCheckedIn ? styles.hidebox : styles.showbox}
        >
          <div className={styles.formGroup}>
            <label htmlFor="barcode">Enter Member Card Number (Barcode):</label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={barcode}
              placeholder="barcode here"
              onChange={(e) => setBarcode(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit">Check-in/Check-out</button>
          </div>
        </form>

        <div
          id={styles.vistorDetails}
          className={`${styles.visitor} ${
            isCheckedIn ? styles.showbox : styles.hidebox
          }`}
        >
          <h2
            style={{
              color: userStatusRef.current.status === "in" ? "green" : "red",
            }}
          >
            {userStatusRef.current.status.toUpperCase()}
          </h2>
          <h3>{userStatusRef.current.greeting}</h3>
          <p>{userStatusRef.current.para1}</p>
          <p>{userStatusRef.current.para2}</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <h3>Total Checked-in Today</h3>
            <p>{summary.checkedInCount}</p>
          </div>
          <div className={styles.statItem}>
            <h3>Total Checked-out Today</h3>
            <p>{summary.checkedOutCount}</p>
          </div>
          <div className={styles.statItem}>
            <h3>Total Currently Available</h3>
            <p>
              {library.total_seats - summary.checkedInCount > 0
                ? library.total_seats - summary.checkedInCount
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
