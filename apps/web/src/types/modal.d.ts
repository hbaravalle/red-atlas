import type { Property } from '@red-atlas/shared';

export type ModalType = 'propertyDetails' | 'createProperty' | null;

export interface ModalState {
  activeModal: ModalType;
  modalData: Property | null;
}
