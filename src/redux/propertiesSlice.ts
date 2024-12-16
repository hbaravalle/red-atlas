import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '../types/property';

interface PropertiesState {
  list: Property[];
}

const initialState: PropertiesState = {
  list: [],
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
  },
});

export const { setProperties, addProperty } = propertiesSlice.actions;
export default propertiesSlice.reducer;
