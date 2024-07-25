import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import "jspdf-autotable"; // This import is crucial

export function downloadJSONAsExcel(jsonData, fileName = "data.xlsx") {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(jsonData);

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate buffer and trigger download
  XLSX.writeFile(workbook, fileName);
}

export function downloadJSONAsPDF(jsonData, fileName = "data.pdf") {
  const doc = new jsPDF();

  // Define table column headers
  const headers = Object.keys(jsonData[0]);
  const data = jsonData.map((item) => headers.map((header) => item[header]));

  // Add a table to the PDF
  doc.autoTable({
    head: [headers],
    body: data,
  });

  // Save the PDF
  doc.save(fileName);
}

export const checkStatus = {
  1: "IN",
  0: "OUT",
};

export function convertIsoToDate(isoTimestamp) {
  try {
    // Create a Date object from the ISO timestamp
    const date = new Date(isoTimestamp);

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid ISO timestamp");
    }

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error(error.message);
    return null; // Or handle the error as needed
  }
}

export function convertTo12Hour(time) {
  if (!time) return "";

  const [hours, minutes, seconds] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12; // Adjust hours to 12-hour format

  return `${adjustedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${period}`;
}
function formatTimeUnit(unit) {
  return unit.toString().padStart(2, "0");
}

export function calculateDuration(checkin, checkout) {
  // Convert time strings to Date objects
  const [checkinHour, checkinMinute, checkinSecond] = checkin
    .split(":")
    .map(Number);
  const [checkoutHour, checkoutMinute, checkoutSecond] = checkout
    .split(":")
    .map(Number);

  // Create Date objects for today with the provided times
  const checkinDate = new Date();
  checkinDate.setHours(checkinHour, checkinMinute, checkinSecond, 0);

  const checkoutDate = new Date();
  checkoutDate.setHours(checkoutHour, checkoutMinute, checkoutSecond, 0);

  // Calculate the difference in milliseconds
  const durationMs = checkoutDate - checkinDate;

  // Convert milliseconds to hours, minutes, and seconds
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format the time units to always have two digits
  return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(
    seconds
  )}`;
}
export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}
export function getCurrentTime(now) {
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
