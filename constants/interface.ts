export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Category {
  idCategory: string;
  label: string;
  color: string;
}

export interface CreationCategory {
  idCreationCategory: string;
  createdDate?: Date;
  idCategory: string;
  idUser: string;
}

export interface Product {
  idProduct: string;
  designation: string;
  color: string;
}

export interface CreationProduct {
  idCreationProduct: string;
  idProduct: string;
  productAmount: number;
  productCoefficient: number;
  createdDate?: Date;
  idCreationCategory: string;
}

export interface ItemAddCategory {
  checked: boolean;
  idCategory: number;
}

export interface settingsPassword {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
