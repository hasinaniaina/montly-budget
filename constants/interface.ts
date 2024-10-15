export type User = {
    id: number,
    email: string,
    password: string
}

export type Category = {
    idCategory: number,
    label: string,
    color: string,
}


export type CreationCategory = {
    idCreationCategory: number,
    createdDate?: Date,
    idCategory: number,
    idUser: number,
    categoryIncome: number
}

export type Product = {
    idProduct: number,
    designation: string,
    color: string,
}

export type CreationProduct = {
    idCreationProduct: number,
    idProduct: number,
    productAmount: number,
    productCoefficient: number,
    createdDate?: Date,
    idCreationCategory: number
}