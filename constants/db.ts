import * as SQLite from "expo-sqlite";

export const init = async (db: SQLite.SQLiteDatabase) => {

  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          email TEXT NOT NULL, 
          password TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS Product (
          id INTEGER PRIMARY KEY  AUTOINCREMENT, 
          designation TEXT NOT NULL, 
          price REAL,
          idUser INTEGER,
          idMonth INTEGER,
          FOREIGN KEY(idUser) REFERENCES User(id)
          FOREIGN KEY(idMonth) REFERENCES Month(id)
          );
      CREATE TABLE IF NOT EXISTS Month (
          id INTEGER PRIMARY KEY  AUTOINCREMENT, 
          name TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS Year (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          number INTEGER);
      `);

      console.log('Database initialized !');
      db.closeAsync();

  } catch(error) {
    console.log("Error while initializing the database",  error);
  }
};


export const createUser =  async (db: SQLite.SQLiteDatabase) => {
    console.log("Database work", db);
}
