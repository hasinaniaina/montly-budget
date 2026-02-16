import * as SQLite from "expo-sqlite";
import {
  Category,
  CreationCategory,
  CreationProduct,
  CsvDataType,
  ItemAddCategory,
  Product,
  User,
} from "./interface";

const db = SQLite.openDatabaseAsync("monthlyBudget", {
  useNewConnection: true,
});

export const init = async () => {
  // await deleteTable();
  await createTable();
};

export const createTable = async () => {
  try {
    await (
      await db
    ).execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS User (
          id TEXT PRIMARY KEY, 
          email TEXT NOT NULL, 
          password TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS Category (
          idCategory TEXT PRIMARY KEY, 
          label TEXT NOT NULL,
          color TEXT NOT NULL
          );
      CREATE TABLE IF NOT EXISTS CreationCategory (
        idCreationCategory TEXT PRIMARY KEY , 
        createdDate  DATETIME DEFAULT CURRENT_TIMESTAMP,
        idCategory TEXT,
        idUser TEXT,
        FOREIGN KEY(idCategory) REFERENCES Category(id),
        FOREIGN KEY(idUser) REFERENCES User(id)
        );
      CREATE TABLE IF NOT EXISTS Product (
          idProduct TEXT PRIMARY KEY, 
          designation TEXT NOT NULL, 
          color TEXT
          );
      CREATE TABLE IF NOT EXISTS CreationProduct (
          idCreationProduct TEXT PRIMARY KEY, 
          productAmount REAL,
          productCoefficient INTEGER,
          idCreationCategory TEXT,
          idProduct TEXT,
          createdDate  DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(idCreationCategory) REFERENCES CreationCategory(id),
          FOREIGN KEY(idProduct) REFERENCES Product(id)
          );
      `);

    console.log("Database initialized!");
    return true;
  } catch (error) {
    console.log("Error while initializing the database", error);
  }
};

export const deleteTable = async () => {
  try {
    await (
      await db
    ).execAsync(`
      DROP TABLE IF EXISTS User;
      DROP TABLE IF EXISTS Category;
      DROP TABLE IF EXISTS CreationCategory;
      DROP TABLE IF EXISTS CreationProduct;
      DROP TABLE IF EXISTS Product;
    `);

    console.log("Table deleted!");

    return true;
  } catch (error) {
    console.log("Error while drop the database", error);
  }
};

export const createUser = async (data: { email: string; password: string }) => {
  const userExist = await getUserByEmail(data.email);
  const uuid = crypto.randomUUID();

  if (userExist == null) {
    try {
      const userCreated = await (
        await db
      ).runAsync(
        "INSERT INTO User (id, email, password) VALUES (?, ?, ?)",
        uuid,
        data.email,
        data.password,
      );

      if (userCreated.changes) {
        try {
          const user: any = await (
            await db
          ).getFirstAsync("SELECT * FROM User WHERE id='" + uuid + "'");

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

export const getUserByPassword = async (password: string): Promise<User> => {
  try {
    const result: any = await (
      await db
    ).getFirstAsync("SELECT * FROM User WHERE password='" + password + "'");
    return result;
  } catch (error) {
    throw "Get User with password error => " + error;
  }
};

export const updateUserPasssword = async (newPassword: string, user: User) => {
  try {
    let updateUser = await (
      await db
    ).runAsync(
      `UPDATE User SET password = ? WHERE id = ?`,
      newPassword,
      user.id,
    );

    return updateUser;
  } catch (error) {
    console.log("Update user password error => ", error);
  }
};

export const insertProduct = async (
  datas: Product | CreationProduct,
  uuidExpense: string,
  uuidCreationExpense: string, 
): Promise<boolean> => {

  try {
    let insertProduct = await (
      await db
    ).runAsync(
      `INSERT INTO Product 
    (idProduct, designation, color) 
    VALUES (?, ?, ?)`,
      uuidExpense,
      (datas as Product).designation,
      (datas as Product).color,
    );

    if (insertProduct.changes) {
      let insertCreationProduct = await (
        await db
      ).runAsync(
        `INSERT INTO CreationProduct 
      (idCreationProduct, productAmount, productCoefficient, idCreationCategory, idProduct) 
      VALUES (?, ?, ? , ?, ?)`,
        uuidCreationExpense,
        (datas as CreationProduct).productAmount,
        (datas as CreationProduct).productCoefficient,
        (datas as CreationProduct).idCreationCategory,
        uuidExpense,
      );

      if (insertCreationProduct.changes) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.log("Product insertion error => ", error);
    return false;
  }
};

export const getProducts = async (category: Category | CreationCategory) => {
  try {
    const product: any = await (
      await db
    ).getAllAsync(`SELECT * 
    FROM Product prod INNER JOIN CreationProduct creatProd ON prod.idProduct = creatProd.idProduct
     WHERE creatProd.idCreationCategory='${
       (category as CreationCategory).idCreationCategory
     }' ORDER BY createdDate DESC`);

    return product ? product : ([] as Product[]);
  } catch (error) {
    console.log("Retrieve products error => ", error);
  }
};

export const getProductsNew = async () => {
  try {
    const product: any = await (
      await db
    ).getAllAsync(
      `SELECT * 
      FROM Product as prod INNER JOIN CreationProduct as creatProd
       ON prod.idProduct = creatProd.idProduct`,
    );

    return product ? product : ([] as Product[] & CreationProduct[]);
  } catch (error) {
    console.log("Retrieve products new error => ", error);
  }
};

export const getProductByIdCreationCategory = async (
  idCreationCategory: string,
) => {
  try {
    const product: any = await (
      await db
    ).getAllAsync(
      `SELECT * 
      FROM Product as prod INNER JOIN CreationProduct as creatProd 
      ON prod.idProduct = creatProd.idProduct 
      WHERE creatProd.idCreationCategory='${idCreationCategory}'`,
    );

    return product ? product : ([] as Product[] & CreationProduct[]);
  } catch (error) {
    console.log(
      "Retrieve products By id Creation Category new error => ",
      error,
    );
  }
};

export const getProductByIdCreationProduct = async (
  idCreationProduct: string,
) => {
  try {
    const product: any = await (
      await db
    ).getFirstAsync(
      `SELECT prod.idProduct
      FROM Product as prod INNER JOIN CreationProduct as creatProd 
      ON prod.idProduct = creatProd.idProduct 
      WHERE creatProd.idCreationProduct='${idCreationProduct}'`,
    );

    if (product.changes) {
      const productCreationProduct: any = await (
        await db
      ).getFirstAsync(
        `SELECT *  FROM CreationProduct 
        WHERE idProduct=${product.idProduct}`,
      );

      return productCreationProduct;
    }

    return [];
  } catch (error) {
    console.log(
      "Retrieve products By id Creation Category new error => ",
      error,
    );
  }
};

export const updateProduct = async (datas: Product | CreationProduct): Promise<boolean> => {
  try {
    let updateProduct = await (
      await db
    ).runAsync(
      `UPDATE Product SET designation = ?, color = ? WHERE idProduct = ?`,
      (datas as Product).designation,
      (datas as Product).color,
      (datas as Product).idProduct,
    );

    if (updateProduct.changes) {
      let updateCreationProduct = await (
        await db
      ).runAsync(
        `UPDATE CreationProduct SET productAmount = ?, productCoefficient = ? WHERE idCreationProduct = ?`,
        (datas as CreationProduct).productAmount,
        (datas as CreationProduct).productCoefficient,
        (datas as CreationProduct).idCreationProduct,
      );

      if (updateCreationProduct.changes) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.log("Product Update error => ", error);
    return false;
  }
};

export const getProductFilter = async (datas: Product | CreationProduct) => {
  try {
    let product: any = "";

    let query = `SELECT * 
    FROM Product prod INNER JOIN CreationProduct creatProd ON prod.idProduct = creatProd.idProduct
    WHERE prod.designation LIKE `;

    query += " '" + (datas as Product).designation.trim() + "%' ";

    query +=
      " AND idCreationCategory= '" +
      (datas as CreationProduct).idCreationCategory +
      "'";

    query += " ORDER BY createdDate DESC";

    product = await (await db).getAllAsync(query);

    return product;
  } catch (error) {
    console.log("fitler by product and date error =>", error);
    return false;
  }
};

export const deleteProduct = async (
  idCreationProduct: string,
  removeProductTable: boolean,
): Promise<boolean> => {
  try {
    let deleteProduct: any = null;

    if (removeProductTable) {
      deleteProduct = await (
        await db
      ).runAsync(`DELETE FROM Product WHERE idProduct = (
      SELECT prod.idProduct 
      FROM Product prod INNER JOIN CreationProduct creatProd 
      ON prod.idProduct = creatProd.idProduct
      WHERE creatProd.idCreationProduct='${idCreationProduct}')`);
    }

    let deleteCreationCategory = await (
      await db
    ).runAsync(
      "DELETE FROM CreationProduct WHERE idCreationProduct='" +
        idCreationProduct +
        "'",
    );

    return true;
  } catch (error) {
    console.log("Delete month record error => ", error);
    return true;
  }
};

export const insertCategory = async (
  datas: Category & CreationCategory,
  user: User,
  idCategory: string,
  idCreationCategory:string
) => {

  try {
    const dbInstance = await db;

    let insertCategory = await dbInstance.runAsync(
      "INSERT INTO Category (idCategory, label, color) VALUES (?, ?, ?)",
      idCategory,
      datas.label!,
      datas.color!,
    );

    if (insertCategory.changes) {
      const insertCreationCategory = await dbInstance.runAsync(
        "INSERT INTO CreationCategory (idCreationCategory, idCategory, idUser) VALUES (?, ?, ?)",
        idCreationCategory,
        idCategory,
        user.id,
      );

      if (insertCreationCategory.changes) {
        return true;
      }
    }
  } catch (error) {
    console.log("Category insertion error =>", error);
    return false;
  }
};

export const insertExistingCategories = async (
  items: ItemAddCategory[],
  user: User,
) => {
  try {
    let insertCreationCategory: any = "";

    for (let item of items) {
      const uuidCreationCategory = crypto.randomUUID();
      insertCreationCategory = await (
        await db
      ).runAsync(
        "INSERT INTO CreationCategory (idCreationCategory, idCategory, idUser) VALUES (?, ?, ?)",
        uuidCreationCategory,
        item.idCategory,
        user.id,
        0,
      );
    }

    return insertCreationCategory;
  } catch (error) {
    console.log("Categories insertion error =>", error);
    return false;
  }
};

export const getCategory = async (user: User, categoryDateFilter: string[]) => {
  if (user && categoryDateFilter) {
    try {
      const dateFrom = categoryDateFilter[0].split("T")[0] + " 01:00:00";
      const dateTo = categoryDateFilter[1].split("T")[0] + " 24:00:00";
      

      let query = `SELECT *
                FROM Category as cat INNER JOIN CreationCategory as creatCat 
                ON cat.idCategory = creatCat.idCategory
                WHERE creatCat.idUser='${user.id}' `;

      query +=
        " AND creatCat.createdDate BETWEEN '" +
        dateFrom +
        "' AND '" +
        dateTo +
        "'";

      query += " ORDER BY cat.idCategory DESC";

      const categories: any = await (await db).getAllAsync(query);

      return categories;
    } catch (error) {
      console.log("Category retrieve error =>", error);
      return false;
    }
  }
};

export const getUserCategory = async (user: User): Promise<(Category & CreationCategory)[]> => {
  try {
    const categories: any = await (
      await db
    ).getAllAsync(`SELECT * 
    FROM Category as cat INNER JOIN CreationCategory as creatCat
    ON cat.idCategory == creatCat.idCategory
    WHERE idUser='${user.id}'`);

    return categories;
  } catch (error) {
    console.log("User category retrieve error =>", error);
    return [];
  }
};

export const getCategoryById = async (idCreationCategory: string) => {
  try {
    const category: any = await (
      await db
    ).getFirstAsync(`SELECT * 
    FROM Category cat INNER JOIN CreationCategory creatCat
    ON cat.idCategory = creatCat.idCategory 
    WHERE creatCat.idCreationCategory='${idCreationCategory}'`);

    return category;
  } catch (error) {
    console.log("Category by id retrieve error =>", error);
    return false;
  }
};

export const deleteCategory = async (
  idCreationCategory: string,
  removeCategory: boolean,
) => {
  const dbtmp = await db;

  try {
    if (removeCategory) {
      const selectCreationCategory: any = await dbtmp.getFirstAsync(
        "SELECT idCategory FROM CreationCategory WHERE idCreationCategory='" +
          idCreationCategory +
          "'",
      );

      if (selectCreationCategory) {
        const deleteCategory: any = await dbtmp.runAsync(
          "DELETE FROM Category WHERE idCategory='" +
            selectCreationCategory.idCategory +
            "'",
        );

        if (deleteCategory.changes) {
          const deleteCreationCategory = await dbtmp.runAsync(
            "DELETE FROM CreationCategory WHERE idCreationCategory='" +
              idCreationCategory +
              "'",
          );

          return deleteCreationCategory;
        }
      }
    } else {
      const deleteCreationCategory = await dbtmp.runAsync(
        "DELETE FROM CreationCategory WHERE idCreationCategory='" +
          idCreationCategory +
          "'",
      );

      if (deleteCreationCategory.changes) {
          const deleteProduct: any = dbtmp.runAsync(
            "DELETE FROM CreationProduct WHERE idCreationCategory='" +
              idCreationCategory +
              "'",
          );

        return deleteCreationCategory;
      }
    }
  } catch (error) {
    console.log("Delete category error =>", error);
    return false;
  }
};

export const updateCategory = async (datas: Category & CreationCategory) => {
  try {
    const updateCategory: any = await (
      await db
    ).runAsync(
      "UPDATE Category SET label = ? , color = ? WHERE idCategory = ? ",
      (datas as Category).label!,
      (datas as Category).color!,
      datas.idCategory!,
    );

    return updateCategory;
  } catch (error) {
    console.log("Update category error =>", error);
    return false;
  }
};

export const getCategoryFilter = async (
  datas: Category[] & CreationCategory[],
  date: string[],
): Promise<string | undefined> => {
  try {
    let category: any = [];

    const dateFrom = date[0].split("T")[0] + " 01:00:00";
    const dateTo = date[1].split("T")[0] + " 24:00:00";
    
    if (datas.length > 0) {
      let query = `SELECT * 
      FROM Category cat INNER JOIN CreationCategory creatCat ON cat.idCategory = creatCat.idCategory
        `;


      if (datas[0].idCategory != "") {
        query += " WHERE ";
        datas.forEach((data, index) => {
          query += " cat.label LIKE '" + data.label + "%' ";
          if (index < datas.length - 1) {
            query += " OR ";
          }
        });

        query +=
          " AND creatCat.createdDate BETWEEN '" +
          dateFrom +
          "' AND '" +
          dateTo +
          "' ";
      } else {
        query +=
          " WHERE creatCat.createdDate BETWEEN '" +
          dateFrom +
          "' AND '" +
          dateTo +
          "' ";
      }
      query += " AND creatCat.idUser = '" + datas[0].idUser + "'";

      category = await (await db).getAllAsync(query);
    }

    return category;
  } catch (error) {
    console.log("fitler by category and date error =>", error);
    return undefined;
  }
};

export const insertCSVIntoCategoryDatabase = async (
  datas: CsvDataType,
  user: User,
) => {
  const uuidCategory = crypto.randomUUID();
  const uuidCreationCategory = crypto.randomUUID();

  try {
    const dbInstance = await db;
    let insertCategory = await dbInstance.runAsync(
      "INSERT INTO Category (idCategory, label, color) VALUES (?, ?, ?)",
      uuidCategory,
      datas.category.trim(),
      datas.categoryColor.trim(),
    );

    if (insertCategory.changes) {
      const insertCreationCategory = await dbInstance.runAsync(
        "INSERT INTO CreationCategory (idCreationCategory, idCategory, idUser, createdDate) VALUES (?, ?, ?, ?)",
        uuidCreationCategory,
        uuidCategory,
        user.id,
        datas.createdDate.trim(),
      );
    }

    return uuidCreationCategory;
  } catch (error) {
    console.log("Category insertion error =>", error);
    return undefined;
  }
};

export const insertCSVIntoProductDatabase = async (
  datas: CsvDataType,
  idCreationCategory: any,
) => {
  const uuidProduct = crypto.randomUUID();

  try {
    let insertProduct = await (
      await db
    ).runAsync(
      `INSERT INTO Product 
    (idProduct, designation, color) 
    VALUES (?, ?, ?)`,
      uuidProduct,
      datas.product.trim(),
      datas.productColor.trim(),
    );

    if (insertProduct.changes) {
      const uuidCreationProduct = crypto.randomUUID();

      let insertCreationProduct = await (
        await db
      ).runAsync(
        `INSERT INTO CreationProduct 
      (idCreationProduct, productAmount, productCoefficient, idCreationCategory, idProduct, createdDate) 
      VALUES (?, ?, ?, ?, ?, ?)`,
        uuidCreationProduct,
        datas.productAmount.trim(),
        datas.productCoefficient.trim(),
        idCreationCategory,
        uuidProduct,
        datas.productCreatedDate.trim(),
      );
      return insertCreationProduct.changes;
    }

    return 0;
  } catch (error) {
    console.log("Product insertion error => ", error);
  }
};

// export const getCatagoriesDatas = async (user: any) => {

// }

// export const getProductDatas = (user: any) => {

// }
