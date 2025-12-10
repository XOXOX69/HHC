import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  dashboardStats: null,
  sales: [],
  transactions: [],
  branchComparison: null,
  loading: false,
  error: "",
};

// Get all branches dashboard statistics
export const loadAllBranchesDashboard = createAsyncThunk(
  "allBranches/loadDashboard",
  async () => {
    try {
      const { data } = await axios.get(`all-branches/dashboard`);
      return data;
    } catch (error) {
      console.log("All branches dashboard error:", error.message);
      return null;
    }
  }
);

// Get all branches sales
export const loadAllBranchesSales = createAsyncThunk(
  "allBranches/loadSales",
  async ({ startDate, endDate } = {}) => {
    try {
      let url = `all-branches/sales`;
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length) url += `?${params.join("&")}`;
      
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.log("All branches sales error:", error.message);
      return null;
    }
  }
);

// Get all branches transactions
export const loadAllBranchesTransactions = createAsyncThunk(
  "allBranches/loadTransactions",
  async ({ startDate, endDate } = {}) => {
    try {
      let url = `all-branches/transactions`;
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length) url += `?${params.join("&")}`;
      
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.log("All branches transactions error:", error.message);
      return null;
    }
  }
);

// Get branch comparison
export const loadBranchComparison = createAsyncThunk(
  "allBranches/loadComparison",
  async () => {
    try {
      const { data } = await axios.get(`all-branches/comparison`);
      return data;
    } catch (error) {
      console.log("Branch comparison error:", error.message);
      return null;
    }
  }
);

const allBranchesSlice = createSlice({
  name: "allBranches",
  initialState,
  reducers: {
    clearAllBranchesData: (state) => {
      state.dashboardStats = null;
      state.sales = [];
      state.transactions = [];
      state.branchComparison = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard stats
    builder.addCase(loadAllBranchesDashboard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllBranchesDashboard.fulfilled, (state, action) => {
      state.loading = false;
      state.dashboardStats = action.payload;
    });
    builder.addCase(loadAllBranchesDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });

    // Sales
    builder.addCase(loadAllBranchesSales.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllBranchesSales.fulfilled, (state, action) => {
      state.loading = false;
      state.sales = action.payload;
    });
    builder.addCase(loadAllBranchesSales.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });

    // Transactions
    builder.addCase(loadAllBranchesTransactions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllBranchesTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = action.payload;
    });
    builder.addCase(loadAllBranchesTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });

    // Branch Comparison
    builder.addCase(loadBranchComparison.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadBranchComparison.fulfilled, (state, action) => {
      state.loading = false;
      state.branchComparison = action.payload;
    });
    builder.addCase(loadBranchComparison.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });
  },
});

export const { clearAllBranchesData } = allBranchesSlice.actions;
export default allBranchesSlice.reducer;
