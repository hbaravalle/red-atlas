import { createSlice } from '@reduxjs/toolkit';

const propertiesSlice = createSlice({
  name: 'properties',
  initialState: [],
  reducers: {
    lorem: (state) => {
      return state;
    },
  },
});

export const { lorem } = propertiesSlice.actions;
export default propertiesSlice.reducer;
