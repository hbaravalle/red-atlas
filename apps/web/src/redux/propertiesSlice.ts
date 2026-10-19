import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SortOption } from '@red-atlas/shared';
import type { ListParams } from './propertiesApi';

// Client state: which page and sort the user picked. The list, the map and
// the detail modal read it to ask RTK Query for the same, cached page.

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
    // A new order starts again from the first page
    setSort: (state, action: PayloadAction<SortOption>) => {
      state.sort = action.payload;
      state.page = 1;
    },
  },
});

export const { setPage, setSort } = propertiesSlice.actions;
export default propertiesSlice.reducer;
