import { ExpoRouter, Router } from "expo-router";
import {
  createUser,
  deleteProduct,
  getCategory,
  getProducts,
  getUserByEmail,
  insertCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
  getProductsNew,
  getCategoryFilter,
  insertProduct,
  updateProduct,
  getProductFilter,
} from "./db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category, Product } from "./interface";

export const saveUser = async ({
  email,
  password,
  confirmationPassword,
  setErrorMessage,
  setModalShown,
  router,
}: {
  email: string;
  password: string;
  confirmationPassword: string;
  setErrorMessage: (val: string[]) => void;
  setModalShown: (val: boolean[]) => void;
  router: Router;
}) => {
  let emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  let errorMessageTmp: Array<string> = [];

  if (
    email.length < 1 ||
    password.length < 1 ||
    confirmationPassword.length < 1
  ) {
    errorMessageTmp.push("Fields should not be empty.");
  }

  if (emailRegExp.test(email) === false) {
    errorMessageTmp.push("E-mail is invalid.");
  }

  if (password.length < 8) {
    errorMessageTmp.push("Password should contain at least 8 characters.");
  }

  if (password !== confirmationPassword) {
    errorMessageTmp.push("Password and Confirmation Password not match.");
  }

  if (errorMessageTmp.length > 0) {
    setErrorMessage(errorMessageTmp);
    setModalShown([true]);
  } else {
    const data = {
      email,
      password,
    };

    const user = await createUser(data);

    if (!user) {
      setErrorMessage(["Email already use!"]);
      setModalShown([true]);
    } else {
      await AsyncStorage.setItem("userCredentials", JSON.stringify(user));
      router.push("/dashboard/home");
    }
  }
};

export const login = async ({
  email,
  password,
  setErrorMessage,
  setModalShown,
  router,
}: {
  email: string;
  password: string;
  setErrorMessage: (val: string[]) => void;
  setModalShown: (val: boolean[]) => void;
  router: Router;
}) => {
  const user = await getUserByEmail(email);

  if (user && password == user.password) {
    await AsyncStorage.setItem("userCredentials", JSON.stringify(user));

    router.push("/dashboard/home");
  } else {
    setErrorMessage(["Authentification failed!"]);
    setModalShown([true, false]);
  }
};

export const logout = async (router: Router) => {
  await AsyncStorage.removeItem("userCredentials");
  router.push("/");
};

export const sendEMail = async ({
  email,
  setErrorMessage,
  setMessage,
  setModalShown,
}: {
  email: string;
  setErrorMessage: (val: string[]) => void;
  setMessage: (val: string) => void;
  setModalShown: (val: boolean[]) => void;
  router: Router;
}) => {
  if (email) {
    const user = await getUserByEmail(email);
    if (user) {
      setMessage("Your password is: " + user.password);
      setModalShown([false, true]);
    } else {
      setErrorMessage(["Email not exist!"]);
      setModalShown([true, false]);
    }
  } else {
    setErrorMessage(["Email field should not be empty!"]);
    setModalShown([true, false]);
  }
};

export const saveProduct = async (
  datas: Product,
  setErrorMessage: (val: string[]) => void,
  setModalShown: (val: boolean[]) => void
) => {

  if (datas.color == "" || datas.designation == "" || datas.amount == 0) {
    setErrorMessage(["All Fields should not be empty!"]);
    setModalShown([true]);
    return false;
  }

  const save = await insertProduct(datas);

  return save;
};

export const editProduct = async (datas: Product,
   setErrorMessage: (val: string[]) => void,
  setModalShown: (val: boolean[]) => void
) => {
  if (datas.color == "" || datas.designation == "") {
    setErrorMessage(["All Fields should not be empty!"]);
    setModalShown([true]);
    return false;
  }

  const edit = await updateProduct(datas);
  return edit;
};

export const retrieveProductByCategory = async () => {
  const products = await getProductsNew();
  return products as Product[];
};

export const retrieveProduct = async (category: Category) => {
  const products = await getProducts(category);
  return products as [Product];
};

export const removeProduct = async (id: number) => {
  const result = await deleteProduct(id);
  return true;
};

export const createCategory = async ({
  datas,
  setErrorMessage,
  setModalShown,
}: {
  datas?: Category;
  setErrorMessage: (val: string[]) => void;
  setModalShown: (val: boolean[]) => void;
}) => {
  let error = false;
  const user: any = await AsyncStorage.getItem("userCredentials");

  if (datas?.label == "") {
    error = true;
  }

  if (datas?.color == "") {
    error = true;
  }

  if (datas?.income == "") {
    error = true;
  }

  if (error) {
    setErrorMessage(["All Fields should not be empty!"]);
    setModalShown([true]);
  } else {
    const CategoryCreated = await insertCategory(datas!, JSON.parse(user));
    if (CategoryCreated) {
      return true;
    }
  }
};

export const retrieveCategory = async (categoryDateFilter: Date[]) => {
  const user: any = await AsyncStorage.getItem("userCredentials");
  return await getCategory(JSON.parse(user), categoryDateFilter);
};

export const removeCategory = async (id: number) => {
  const result = await deleteCategory(id);

  if (result.changes) {
    return true;
  }
  return false;
};

export const retrieveCategoryById = async (id: number) => {
  const category = await getCategoryById(id);
  return category;
};

export const upgradeCategory = async ({
  datas,
  setErrorMessage,
  setModalShown,
}: {
  datas?: Category;
  setErrorMessage: (val: string[]) => void;
  setModalShown: (val: boolean[]) => void;
}) => {
  let error = false;

  if (datas?.label == "") {
    error = true;
  }

  if (datas?.color == "") {
    error = true;
  }

  if (datas?.income == "") {
    error = true;
  }

  if (error) {
    setErrorMessage(["All Fields should not be empty!"]);
    setModalShown([true]);
  } else {
    const updated = await updateCategory(datas!);

    if (updated) {
      return true;
    }
  }
};

export const filterCategory = async (datas: Category[], date: Date[]) => {
  const user: any = await AsyncStorage.getItem("userCredentials");

  datas.forEach((data, index) => { 
    datas[index].idUser = JSON.parse(user).id;
  });

  return await getCategoryFilter(datas, date);
};

export const filterProduct = async (datas: Product[]): Promise<Product[]> => {
  console.log("datas =>" + datas);

  return await getProductFilter(datas);
};

export const getUserEmail = async (): Promise<String> => {
  const user = await AsyncStorage.getItem("userCredentials");
  return user!;
};
