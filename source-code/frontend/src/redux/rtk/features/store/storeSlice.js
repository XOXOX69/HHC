import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  list: [],
  store: null,
  selectedStore: null,
  total: 0,
  loading: false,
  error: "",
};

// Get all stores
export const loadAllStore = createAsyncThunk(
  "store/loadAllStore",
  async () => {
    try {
      const { data } = await axios.get(`store?status=true`);
      return data;
    } catch (error) {
      console.log("Store load error:", error.message);
      return [];
    }
  }
);

// Get all stores paginated
export const loadAllStorePaginated = createAsyncThunk(
  "store/loadAllStorePaginated",
  async ({ page, count, status }) => {
    try {
      const { data } = await axios.get(
        `store/paginated?status=${status || "true"}&page=${page}&count=${count}`
      );
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

// Get single store
export const loadSingleStore = createAsyncThunk(
  "store/loadSingleStore",
  async (id) => {
    try {
      const { data } = await axios.get(`store/${id}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

// Add new store
export const addStore = createAsyncThunk(
  "store/addStore",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `store`,
        data: values,
      });
      return data;
    } catch (error) {
      console.log(error.message);
      // Return the error message from backend
      const errorMessage = error.response?.data?.error || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// Update store
export const updateStore = createAsyncThunk(
  "store/updateStore",
  async ({ id, values }) => {
    try {
      const { data } = await axios({
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `store/${id}`,
        data: values,
      });
      return data;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
);

// Delete store
export const deleteStore = createAsyncThunk(
  "store/deleteStore",
  async (id) => {
    try {
      const { data } = await axios({
        method: "patch",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `store/${id}`,
      });
      return { id, ...data };
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
);

// Get store statistics
export const loadStoreStatistics = createAsyncThunk(
  "store/loadStoreStatistics",
  async (id) => {
    try {
      const { data } = await axios.get(`store/${id}/statistics`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    clearStore: (state) => {
      state.store = null;
    },
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
      // Save to localStorage for persistence
      if (action.payload) {
        localStorage.setItem("selectedStoreId", action.payload.id);
        localStorage.setItem("selectedStoreName", action.payload.name);
      } else {
        localStorage.removeItem("selectedStoreId");
        localStorage.removeItem("selectedStoreName");
      }
    },
    loadSelectedStoreFromStorage: (state) => {
      const storeId = localStorage.getItem("selectedStoreId");
      const storeName = localStorage.getItem("selectedStoreName");
      if (storeId && storeName) {
        state.selectedStore = { id: parseInt(storeId), name: storeName };
      }
    },
  },
  extraReducers: (builder) => {
    // Load all stores
    builder.addCase(loadAllStore.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllStore.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload || [];
    });
    builder.addCase(loadAllStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });

    // Load all stores paginated
    builder.addCase(loadAllStorePaginated.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAllStorePaginated.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload?.data || [];
      state.total = action.payload?.total || 0;
    });
    builder.addCase(loadAllStorePaginated.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });

    // Load single store
    builder.addCase(loadSingleStore.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadSingleStore.fulfilled, (state, action) => {
      state.loading = false;
      state.store = action.payload;
    });
    builder.addCase(loadSingleStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });

    // Add store
    builder.addCase(addStore.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addStore.fulfilled, (state, action) => {
      state.loading = false;
      if (!state.list) {
        state.list = [];
      }
      state.list.push(action.payload);
    });
    builder.addCase(addStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });

    // Update store
    builder.addCase(updateStore.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateStore.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.list.findIndex(
        (store) => store.id === action.payload.id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    });
    builder.addCase(updateStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });

    // Delete store
    builder.addCase(deleteStore.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteStore.fulfilled, (state, action) => {
      state.loading = false;
      state.list = state.list.filter(
        (store) => store.id !== action.payload.id
      );
    });
    builder.addCase(deleteStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message;
    });
  },
});

export const { clearStore, setSelectedStore, loadSelectedStoreFromStorage } = storeSlice.actions;
export default storeSlice.reducer;
