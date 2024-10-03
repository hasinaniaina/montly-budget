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
    idUser: number,
    idMonth: number,
    yearNumber: number,
    idCategory: number,
    percentage: number
}

export type Category = {
    id?: number,
    label?: string,
    income?: string,
    color?: string
}