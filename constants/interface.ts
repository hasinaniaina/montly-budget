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

export interface ExportProductDatas {
  designation: string;
  color: string;
  productAmount: number;
  productCoefficient: number;
  createdDate: string;
}

export interface ExportDatas {
  label: string;
  color: string;
  products: Array<ExportProductDatas>;
}

export interface CsvDatas {
  categoryDatas: CsvDataType[], 
  productDatas: CsvDataType[][] 
}

export type CsvDataType = {
  [key: string]: string
}