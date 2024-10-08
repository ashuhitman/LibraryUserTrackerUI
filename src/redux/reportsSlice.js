// reportsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { REPORTS_API } from "../utils/constants";

// Async thunk for fetching reports
export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async (URL) => {
    const response = await axios.get(URL);

    return response.data;
  }
);

// Async thunk for adding a new report
export const addReport = createAsyncThunk(
  "reports/addReport",
  async (newReport) => {
    const response = await axios.post(REPORTS_API.CHECKINOUT, newReport);
    return response.data;
  }
);

// Async thunk for fetching summary
export const fetchSummary = createAsyncThunk(
  "reports/fetchSummary",
  async () => {
    const today = new Date().toISOString().split("T")[0];
    const response = await axios.get(`${REPORTS_API.SUMMARY}?date=${today}`);

    return response.data;
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    data: [],
    summary: { checkedInCount: 0, checkedOutCount: 0 },
    latest: {},
    today: false,
    fetchStatus: "idle", // "idle" | "loading" | "succeeded" | "failed"
    addStatus: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
    summaryStatus: "idle", // "idle" | "loading" | "succeeded" | "failed"
  },
  reducers: {
    clearLatest: (state) => {
      state.latest = {};
    },
  },
  extraReducers: (builder) => {
    // Handle fetch reports
    builder
      .addCase(fetchReports.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        const { reports, today } = action.payload;

        state.data = reports;
        state.today = today;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message;
      });

    // Handle add report
    builder
      .addCase(addReport.pending, (state) => {
        state.addStatus = "loading";
        state.error = null;
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        const { row } = action.payload;
        const { id, checkout } = row;

        if (checkout) {
          state.data = state.data.map((item) => (item.id === id ? row : item));
          state.latest = { row, actionType: 1 };
          state.summary.checkedOutCount += 1;
          state.summary.checkedInCount -= 1;
        } else {
          state.data = [row, ...state.data];
          state.latest = { row, actionType: 0 };
          state.summary.checkedInCount += 1;
        }
      })
      .addCase(addReport.rejected, (state, action) => {
        state.addStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSummary.pending, (state) => {
        state.summaryStatus = "loading";
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summaryStatus = "succeeded";
        const { checkedInCount, checkedOutCount } = action.payload.summary;
        state.summary.checkedInCount = Number(checkedInCount);
        state.summary.checkedOutCount = Number(checkedOutCount);
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.summaryStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearLatest } = reportsSlice.actions;
export default reportsSlice.reducer;
