import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SortOption } from '@red-atlas/shared';
import type { ListParams } from './propertiesApi';

// Client state: the page and sort the list, map and detail all share

const initialState: ListParams = {
  page: 1,
  sort: 'date',
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    // A new sort starts from page 1
    setSort: (state, action: PayloadAction<SortOption>) => {
      state.sort = action.payload;
      state.page = 1;
    },
  },
});

export const { setPage, setSort } = propertiesSlice.actions;
export default propertiesSlice.reducer;
