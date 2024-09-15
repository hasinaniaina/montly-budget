import { openDatabaseSync } from "expo-sqlite";
import { createUser } from "./db";

const db = openDatabaseSync("monthlyBudget");

export const saveUser = ({
  email,
  password,
  confirmationPassword,
  setErrorMessage,
  setModalShown,
}: {
  email: string;
  password: string;
  confirmationPassword: string;
  setErrorMessage: (val: string[]) => void;
  setModalShown: (val: boolean) => void;
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
    setModalShown(true);
  } else {
    createUser(db);
  }
};
