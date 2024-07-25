import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LIBRARYINFO_API } from "../utils/constants";

// Async thunk to fetch library info
export const fetchLibraryInfo = createAsyncThunk(
  "libraryInfo/fetchLibraryInfo",
  async () => {
    const response = await axios.get(LIBRARYINFO_API.FETCH);
    return response.data;
  }
);

// Async thunk to update library info
export const updateLibraryInfo = createAsyncThunk(
  "libraryInfo/updateLibraryInfo",
  async ({ id, institution_name, library_name, total_seats }) => {
    const response = await axios.post(LIBRARYINFO_API.UPDATE, {
      id,
      institution_name,
      library_name,
      total_seats,
    });
    return response.data;
  }
);

const libraryInfoSlice = createSlice({
  name: "libraryInfo",
  initialState: {
    data: [],
    status: "idle", // "idle" | "loading" | "fetched" | "failed" | "updated"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibraryInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLibraryInfo.fulfilled, (state, action) => {
        state.status = "fetched";
        state.data = action.payload.info;
      })
      .addCase(fetchLibraryInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateLibraryInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateLibraryInfo.fulfilled, (state, action) => {
        state.status = "updated";
        // Update the state with the new library info
        state.data = action.payload.info;
      })
      .addCase(updateLibraryInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default libraryInfoSlice.reducer;
