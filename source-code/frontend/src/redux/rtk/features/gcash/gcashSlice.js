import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { errorHandler, successHandler } from "../../../../utils/functions";
import queryGenerator from "../../../../utils/queryGenarator";

const initialState = {
  list: null,
  total: null,
  aggregations: null,
  transaction: null,
  customerTransactions: null,
  error: "",
  loading: false,
};

// Initialize GCash payment
export const initializeGcashPayment = createAsyncThunk(
  "gcash/initializePayment",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `gcash/initialize`,
        data: values,
      });
      return successHandler(data, "Payment initialized successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

// Verify GCash payment (submit GCash reference)
export const verifyGcashPayment = createAsyncThunk(
  "gcash/verifyPayment",
  async ({ id, values }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `gcash/verify/${id}`,
        data: values,
      });
      return successHandler(data, "GCash reference submitted successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

// Admin confirm GCash payment
export const confirmGcashPayment = createAsyncThunk(
  "gcash/confirmPayment",
  async ({ id, values }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `gcash/confirm/${id}`,
        data: values,
      });
      return successHandler(data, "Payment confirmed successfully");
    } catch (error) {
      return errorHandler(error, true);
    }
  }
);

// Load all GCash transactions (admin)
export const loadAllGcashTransactions = createAsyncThunk(
  "gcash/loadAllTransactions",
  async (arg) => {
    try {
      const query = queryGenerator(arg);
      const { data } = await axios.get(`gcash?${query}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

// Load single GCash transaction
export const loadSingleGcashTransaction = createAsyncThunk(
  "gcash/loadSingleTransaction",
  async (id) => {
    try {
      const { data } = await axios.get(`gcash/${id}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

// Load customer's GCash transactions
export const loadCustomerGcashTransactions = createAsyncThunk(
  "gcash/loadCustomerTransactions",
  async (customerId) => {
    try {
      const { data } = await axios.get(`gcash/customer/${customerId}`);
      return successHandler(data);
    } catch (error) {
      return errorHandler(error);
    }
  }
);

const gcashSlice = createSlice({
  name: "gcash",
  initialState,
  reducers: {
    clearGcash: (state) => {
      state.transaction = null;
    },
  },
  extraReducers: (builder) => {
    // Initialize payment
    builder.addCase(initializeGcashPayment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(initializeGcashPayment.fulfilled, (state, action) => {
      state.loading = false;
      state.transaction = action.payload?.data?.data;
    });
    builder.addCase(initializeGcashPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Verify payment
    builder.addCase(verifyGcashPayment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyGcashPayment.fulfilled, (state, action) => {
      state.loading = false;
      state.transaction = action.payload?.data?.data;
    });
    builder.addCase(verifyGcashPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Confirm payment (admin)
    builder.addCase(confirmGcashPayment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(confirmGcashPayment.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(confirmGcashPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Load all transactions
    builder.addCase(loadAllGcashTransactions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllGcashTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.data?.transactions;
      state.total = action.payload?.data?.total;
      state.aggregations = action.payload?.data?.aggregations;
    });
    builder.addCase(loadAllGcashTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Load single transaction
    builder.addCase(loadSingleGcashTransaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadSingleGcashTransaction.fulfilled, (state, action) => {
      state.loading = false;
      state.transaction = action.payload?.data;
    });
    builder.addCase(loadSingleGcashTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });

    // Load customer transactions
    builder.addCase(loadCustomerGcashTransactions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadCustomerGcashTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.customerTransactions = action.payload?.data;
    });
    builder.addCase(loadCustomerGcashTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });
  },
});

export default gcashSlice.reducer;
export const { clearGcash } = gcashSlice.actions;
