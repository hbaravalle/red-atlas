import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalType, ModalState } from '../types/modal';
import { Property } from '../types/property';

const initialState: ModalState = {
  activeModal: null,
  modalData: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ modal: ModalType; data?: Property }>
    ) => {
      if (action.payload.modal === null) return;
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
