import * as SQLite from "expo-sqlite";
import { Category, Product, User } from "./interface";

const db = SQLite.openDatabaseAsync("monthlyBudget", {
  useNewConnection: true,
});

export const init = async () => {
  // deleteTable();
  await createTable();
  // await setYear();
  // await setMonths();
  // deleteMonth();
};

export const createTable = async () => {
  try {
    await (
      await db
    ).execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          email TEXT NOT NULL, 
          password TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS Product (
          id INTEGER PRIMARY KEY  AUTOINCREMENT, 
          designation TEXT NOT NULL, 
          amount REAL,
          percentage REAL,
          idCategory INTEGER,
          color TEXT,
          createdDate  DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(idCategory) REFERENCES Category(id)
          );
      CREATE TABLE IF NOT EXISTS Category (
          id INTEGER PRIMARY KEY  AUTOINCREMENT, 
          label TEXT NOT NULL,
          income REAL NOT NULL,
          color TEXT NOT NULL,
          idUser INTEGER,
          createdDate  DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(idUser) REFERENCES User(id)
          );
      `);

    console.log("Database initialized!");
  } catch (error) {
    console.log("Error while initializing the database", error);
  }
};

export const deleteTable = async () => {
  try {
    await (
      await db
    ).execAsync(`
      DROP TABLE User;
      DROP TABLE Product;
      DROP TABLE Category;
    `);

    console.log("Table deleted!");
  } catch (error) {
    console.log("Error while drop the database", error);
  }
};

export const createUser = async (data: { email: string; password: string }) => {
  const userExist = await getUserByEmail(data.email);

  if (userExist == null) {
    try {
      const userCreated = await (
        await db
      ).runAsync(
        "INSERT INTO User (email, password) VALUES (?, ?)",
        data.email,
        data.password
      );

      if (userCreated.changes) {
        try {
          const user: any = await (
            await db
          ).getFirstAsync(
            "SELECT * FROM User WHERE id='" + userCreated.lastInsertRowId + "'"
          );

          return user;
        } catch (error) {
          console.log("Fecthing last user error => " + error);
          return false;
        }
      }

      return false;
    } catch (error) {
      console.log("Creating user error => " + error);
      return false;
    }
  } else {
    return false;
  }
};

export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const result: any = await (
      await db
    ).getFirstAsync("SELECT * FROM User WHERE email='" + email + "'");
    return result;
  } catch (error) {
    throw "Get User with email => " + error;
  }
};

// export const setYear = async () => {
//   const currentYear = new Date().getFullYear();
//   const years = await getYear();
//   let isYearExist = false;

//   if (years) {
//     for (let year of years) {
//       if (year.number == currentYear) {
//         isYearExist = true;
//         break;
//       }
//     }
//   }

//   if (!isYearExist) {
//     try {
//       let query = await (
//         await db
//       ).runAsync("INSERT INTO Year (number) VALUES (?)", currentYear);

//       console.log(query);
//     } catch (error) {
//       console.log("Year insertion error => ", error);
//     }
//   }
// };

// export const getYear = async () => {
//   try {
//     const year: any = await (await db).getAllAsync("SELECT number FROM Year");
//     return year;
//   } catch (error) {
//     console.log("Retrieve year error => ", error);
//   }
// };

// export const setMonths = async () => {
//   const monthInserted = await getMonth();
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   if (monthInserted.length == 0) {
//     try {
//       monthNames.map(async (monthName) => {
//         let query = await (
//           await db
//         ).runAsync("INSERT INTO Month (name) VALUES (?)", monthName);
//         console.log(query);
//       });
//     } catch (error) {
//       console.log("Year insertion error => ", error);
//     }
//   }
// };

export const getMonth = async () => {
  try {
    const months: any = await (await db).getAllAsync("SELECT * FROM Month");
    return months;
  } catch (error) {
    console.log("Retrieve year error => ", error);
  }
};

export const getMonthById = async (id: string) => {
  try {
    const months: any = await (
      await db
    ).getAllAsync("SELECT name FROM Month WHERE id=" + id);
    return months;
  } catch (error) {
    console.log("Retrieve year error => ", error);
  }
};

export const deleteMonth = async () => {
  try {
    let query = await (await db).runAsync("DELETE FROM Month");

    console.log(query);
  } catch (error) {
    console.log("Delete month record error => ", error);
  }
};

export const createProduct = async (data: {
  color: string;
  name: string;
  amount: string;
  idUser: string;
  idMonth: string;
  yearNumber: string;
}) => {
  let sumAmount = 0;

  let percentage = 1;

  const products = await getProducts(
    data.idUser,
    data.idMonth,
    data.yearNumber
  );

  if (products) {
    if (products.length == 0) {
      return await insertProduct(data, percentage);
    } else {
      products.forEach((product: Product) => {
        sumAmount += product.amount;
      });

      percentage = parseInt(data.amount) / (sumAmount + parseInt(data.amount));

      await insertProduct(data, percentage);

      products.forEach(async (product: Product) => {
        percentage = product.amount / (sumAmount + parseInt(data.amount));
        await updateProduct(product.id, percentage);
      });

      return true;
    }
  }
};

export const getProducts = async (
  idUser: string,
  idMonth: string,
  yearNumber: string
) => {
  try {
    const product: any = await (
      await db
    ).getAllAsync(
      "SELECT * FROM Product WHERE idUser=" +
        idUser +
        " AND idMonth=" +
        idMonth +
        " AND yearNumber=" +
        yearNumber +
        " ORDER BY id DESC "
    );
    return product ? product : ([] as Product[]);
  } catch (error) {
    console.log("Retrieve year error => ", error);
  }
};

export const getProductsNew = async () => {
  try {
    const product: any = await (await db).getAllAsync("SELECT * FROM Product");
    return product ? product : ([] as Product[]);
  } catch (error) {
    console.log("Retrieve year error => ", error);
  }
};

export const updateProduct = async (id: number, percentage: number) => {
  try {
    let query = await (
      await db
    ).runAsync(
      `UPDATE Product SET percentage = ? WHERE id = ?`,
      percentage,
      id
    );

    return query;
  } catch (error) {
    console.log("Year insertion error => ", error);
  }
};

export const insertProduct = async (
  data: {
    color: string;
    name: string;
    amount: string;
    idUser: string;
    idMonth: string;
    yearNumber: string;
  },
  percentage: number
) => {
  try {
    let query = await (
      await db
    ).runAsync(
      `INSERT INTO Product 
    (designation, amount, percentage, idUser, idMonth, yearNumber, color) 
    VALUES (?, ? , ?, ?, ?, ?, ?)`,
      data.name,
      parseInt(data.amount),
      percentage,
      parseInt(data.idUser),
      parseInt(data.idMonth),
      parseInt(data.yearNumber),
      data.color
    );

    return query;
  } catch (error) {
    console.log("Year insertion error => ", error);
  }
};

export const deleteProduct = async (id: number, productData: Product[]) => {
  try {
    let query = await (await db).runAsync("DELETE FROM Product WHERE id=" + id);

    if (query) {
      const idUser = productData[0].idUser.toString();
      const idMonth = productData[0].idMonth.toString();
      const yearNumber = productData[0].yearNumber.toString();

      const products = await getProducts(idUser, idMonth, yearNumber);
      let percentage = 0;
      let sumAmount = 0;

      products.forEach((product: Product) => {
        sumAmount += product.amount;
      });

      let update: any = "";
      products.forEach(async (product: Product) => {
        percentage = product.amount / sumAmount;
        update = await updateProduct(product.id, percentage);
      });

      return update;
    }
  } catch (error) {
    console.log("Delete month record error => ", error);
  }
};

export const updateProductById = async (
  newColor: string,
  newName: string,
  newAmount: string,
  index: number,
  productData: Product[]
) => {
  const idUser = productData[index].idUser.toString();
  const idMonth = productData[index].idMonth.toString();
  const yearNumber = productData[index].yearNumber.toString();
  const idProduct = productData[index].id;

  const products = await getProducts(idUser, idMonth, yearNumber);

  let sumAmount = 0;
  let newSumAmount = 0;
  let newPercentage = 0;
  let oldAmout = productData[index].amount;

  products.forEach((product: Product) => {
    sumAmount += product.amount;
  });

  newSumAmount = sumAmount - oldAmout + parseFloat(newAmount);
  newPercentage = parseFloat(newAmount) / newSumAmount;

  try {
    let query = await (
      await db
    ).runAsync(
      `UPDATE Product SET color = ?, designation = ?, amount = ?, percentage = ? WHERE id = ?`,
      newColor,
      newName,
      newAmount,
      newPercentage,
      idProduct
    );

    return query;
  } catch (error) {
    console.log("Year insertion error => ", error);
  }
};

export const insertCategory = async (datas: Category, user: User) => {
  try {
    let query = await (
      await db
    ).runAsync(
      "INSERT INTO Category (label, income, color, idUser) VALUES (?, ?, ?, ?)",
      datas.label!,
      datas.income!,
      datas.color!,
      user.id
    );

    return query;
  } catch (error) {
    console.log("Category insertion error =>", error);
    return false;
  }
};

export const getCategory = async (user: User, categoryDateFilter: Date[]) => {
  try {
    const categories: any = await (
      await db
    ).getAllAsync(
      "SELECT * FROM Category WHERE idUser=" +
        user.id +
        " AND createdDate BETWEEN " +
        JSON.stringify(categoryDateFilter[0]) +
        " AND " +
        JSON.stringify(categoryDateFilter[1])
    );

    return categories;
  } catch (error) {
    console.log("Category retrieve error =>", error);
    return false;
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const category: any = await (
      await db
    ).getFirstAsync("SELECT * FROM Category WHERE id=" + id);
    return category;
  } catch (error) {
    console.log("Category by id retrieve error =>", error);
    return false;
  }
};

export const deleteCategory = async (id: number) => {
  const dbtmp = await await db;
  try {
    const deleteCategory: any = dbtmp.runAsync(
      "DELETE FROM Category WHERE id=" + id
    );

    setTimeout(() => {
      const deleteProduct: any = dbtmp.runAsync(
        "DELETE FROM Product WHERE idCategory=" + id
      );
    }, 1000);

    return deleteCategory;
  } catch (error) {
    console.log("Delete category error =>", error);
    return false;
  }
};

export const updateCategory = async (datas: Category) => {
  try {
    const update: any = await (
      await db
    ).runAsync(
      "UPDATE Category SET label = ? , income = ? , color = ? WHERE id = ? ",
      datas.label!,
      datas.income!,
      datas.color!,
      datas.id!
    );

    return update;
  } catch (error) {
    console.log("Update category error =>", error);
    return false;
  }
};

export const getCategoryFilter = async (datas: Category[], date: Date[]) => {
  try {
    let category: any = "";
    if (datas[0].id) {
      category = await (
        await db
      ).getAllAsync(
        "SELECT * FROM Category WHERE label LIKE '%" +
          datas[0].label +
          "%' AND createdDate BETWEEN " +
          JSON.stringify(date[0]) +
          " AND " +
          JSON.stringify(date[1])
      );
    } else {
      category = await (
        await db
      ).getAllAsync(
        "SELECT * FROM Category WHERE createdDate BETWEEN " +
          JSON.stringify(date[0]) +
          " AND " +
          JSON.stringify(date[1])
      );
    }
    return category;
  } catch (error) {
    console.log("fitler by category and date error =>", error);
    return false;
  }
};
