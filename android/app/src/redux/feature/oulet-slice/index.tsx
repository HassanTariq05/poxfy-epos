import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedOutlet: {},
};

const outletSlice = createSlice({
  name: 'outlet',
  initialState,
  reducers: {
    setSelectedOutlet: (state, action) => {
      state.selectedOutlet = action.payload;
    },
  },
});

export const {setSelectedOutlet} = outletSlice.actions;
export const getSelectedOutlet = (state: any) => state.outlet;
export default outletSlice.reducer;
