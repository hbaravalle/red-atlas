export type ModalType = 'propertyDetails' | 'createProperty' | null;

export interface ModalState {
  activeModal: ModalType;
  modalData: any | null;
}
