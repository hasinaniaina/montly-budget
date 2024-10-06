export type User = {
    id: number,
    email: string,
    password: string
}

export type Product = {
    id: number,
    designation: string,
    amount: number,
    color: string,
    idCategory: number,
    coefficient: number,
    createdDate?: Date
}

export type Category = {
    id?: number,
    label?: string,
    income?: string,
    color?: string,
    createdDate?: Date,
    idUser?: number
}