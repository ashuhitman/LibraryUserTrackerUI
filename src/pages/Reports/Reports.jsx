import React, { useEffect, useRef, useState } from "react";
import styles from "./Reports.module.css";
import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import data from "../../data/data.json";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  checkStatus,
  convertIsoToDate,
  downloadJSONAsExcel,
  downloadJSONAsPDF,
} from "../../utils/utils";
import Pagination from "../../components/Pagination/Pagination";
import { fetchReports } from "../../redux/reportsSlice";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import Loader from "../../components/Loader/Loader";
import { REPORTS_API } from "../../utils/constants";

function Reports() {
  const {
    today,
    data: reports,
    fetchStatus,
    error,
  } = useSelector((state) => state.reports);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const location = useLocation();

  const totalPages = Math.ceil(reports.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  useEffect(() => {
    document.title = "Reports";
    const { startDate, endDate } = getQueryParams();
    if (startDate && endDate) {
      const query = `startDate=${startDate}&endDate=${endDate}`;
      dispatch(fetchReports(`${REPORTS_API.FETCH}?${query}`));
    } else {
      if (fetchStatus === "idle") {
        dispatch(fetchReports(REPORTS_API.FETCH));
      }
    }

    console.log(getQueryParams());
  }, [location.search]);

  // Function to parse query string
  const getQueryParams = () => {
    const queryParams = new URLSearchParams(location.search);
    return {
      startDate: queryParams.get("startDate"),
      endDate: queryParams.get("endDate"),
    };
  };

  // goto previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // goto next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // download as excel or pdf file
  const download = (type = 0) => {
    if (type === 0) {
      downloadJSONAsExcel(reports);
    } else if (type === 1) {
      downloadJSONAsPDF(reports);
    }
  };
  const fetchTodayData = () => {
    if (today) {
      console.log("already downloaded");
    } else {
      dispatch(fetchReports("http://localhost:8000/reports"));
    }
  };
  return (
    <>
      {fetchStatus === "loading" && <Loader />}
      <div className={styles.container}>
        <div className={styles.reports}>
          <div className={styles.header}>
            <Link to="/home" className={styles.link}>
              <FaHome />
            </Link>

            <button
              style={{
                backgroundColor: today ? "#04aa6d" : "",
                color: today ? "white" : "",
              }}
              onClick={fetchTodayData}
            >
              Today
            </button>

            <button type="button" onClick={() => download(0)}>
              Excel
            </button>
            <button type="button" onClick={() => download(1)}>
              pdf
            </button>
            <FilterComponent />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.body}>
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>barcode</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports
                  .slice(start, end)
                  .filter((row) => {
                    if (!searchTerm.trim()) return true;
                    const values = Object.values(row);
                    const keys = Object.keys(row);
                    const search = searchTerm.toLocaleLowerCase();

                    // Check if any value in the row matches the search term
                    for (let i = 1; i < values.length; i++) {
                      if (values[i] !== null && values[i] !== undefined) {
                        if (keys[i] === "status") {
                          if (
                            checkStatus[values[i]]
                              .toLowerCase()
                              .includes(search)
                          ) {
                            return true;
                          }
                        } else if (
                          values[i].toString().toLowerCase().includes(search)
                        ) {
                          return true;
                        }
                      }
                    }

                    // Return false if no matching values are found
                    return false;
                  })
                  .map((row, index) => (
                    <tr key={index + row.checkin}>
                      <td>{index + start + 1}</td>
                      <td>{row.barcode}</td>
                      <td>{row.checkin}</td>
                      <td>{row.checkout}</td>
                      <td>{convertIsoToDate(row.created_date)}</td>
                      <td>{checkStatus[row.status]}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={styles.foot}>
            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                onNext={goToNextPage}
                onPrevious={goToPreviousPage}
                totalPages={totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;
