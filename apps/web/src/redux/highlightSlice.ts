import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The property whose card is hovered or focused, so the map can highlight its
// pin. Kept apart from the list params, which are RTK Query's arguments

interface HighlightState {
  id: string | null;
}

const initialState: HighlightState = { id: null };

const highlightSlice = createSlice({
  name: 'highlight',
  initialState,
  reducers: {
    highlight: (state, action: PayloadAction<string | null>) => {
      state.id = action.payload;
    },
  },
});

export const { highlight } = highlightSlice.actions;
export default highlightSlice.reducer;
