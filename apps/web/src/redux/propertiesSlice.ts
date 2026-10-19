import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Property } from '@red-atlas/shared';

interface PropertiesState {
  list: Property[];
  // Bumped when the data behind the list changes, so PropertyList reloads
  // the page and sort it is showing
  listVersion: number;
  searchResults: Property[];
  sort: string;
}

const initialState: PropertiesState = {
  list: [],
  listVersion: 0,
  searchResults: [],
  sort: 'date',
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.list = action.payload;
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      state.list.push(action.payload);
    },
    setSearchResults: (state, action: PayloadAction<Property[]>) => {
      state.searchResults = action.payload;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
    },
    invalidateList: (state) => {
      state.listVersion += 1;
    },
  },
});

export const {
  setProperties,
  addProperty,
  setSearchResults,
  setSort,
  invalidateList,
} = propertiesSlice.actions;
export default propertiesSlice.reducer;
