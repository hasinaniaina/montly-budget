export interface User {
  id: number;
  email: string;
  password: string;
}

export interface Category {
  idCategory: number;
  label: string;
  color: string;
}

export interface CreationCategory {
  idCreationCategory: number;
  createdDate?: Date;
  idCategory: number;
  idUser: number;
  categoryIncome: number;
}

export interface Product {
  idProduct: number;
  designation: string;
  color: string;
}

export interface CreationProduct {
  idCreationProduct: number;
  idProduct: number;
  productAmount: number;
  productCoefficient: number;
  createdDate?: Date;
  idCreationCategory: number;
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
