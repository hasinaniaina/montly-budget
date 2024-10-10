import { ViewStyle } from "react-native";
import { Category } from "./interface";
import { removeCategory, retrieveUserCategory } from "./Controller";

export const amountRemainingProduct = (
  datas: any,
  amountRemaining: number,
  setErrorMessage: (val: string[]) => void,
  setModalShown: (val: boolean[]) => void,
  setshowLoading: (val: ViewStyle) => void
) => {
  if (parseFloat(datas.amount) * datas.coefficient > amountRemaining) {
    setErrorMessage([
      "The amount should not exceed: " + amountRemaining + " Ar",
    ]);

    setModalShown([true]);

    setTimeout(() => {
      setshowLoading({ display: "none" });
    }, 2000);

    return false;
  }
  return true;
};

export const checkIfCategorylabelAlreadyStored = async (datas: Category) => {
  const userCategories = await retrieveUserCategory();

  let isCategoryLabelNotExist = true;

  const label = datas.label;

  let dateCreated = new Date().toISOString().split("T")[0].split("-");

  const dateCreatedFormated = dateCreated[1] + "-" + dateCreated[0];

  //  Check if category exist on database
  userCategories.forEach((userCategory: Category) => {
    let dateCategoryStoredCreated = new Date(userCategory.createdDate!)
      .toISOString()
      .split("T")[0]
      .split("-");

    let dateCategoryStoredCreatedFormated =
      dateCategoryStoredCreated[1] + "-" + dateCategoryStoredCreated[0];

    if (userCategory.label?.toLocaleLowerCase() === label?.toLocaleLowerCase()) {
      if (dateCategoryStoredCreatedFormated === dateCreatedFormated) {
        isCategoryLabelNotExist = false;
      }
    }
  });

  return isCategoryLabelNotExist;
};

export const isFilteredActivate = (isCategoryFiltered: boolean[], index: number, value: boolean ) => {
  let isFiltered = [...isCategoryFiltered!];
  isFiltered[index] = true;
  return isFiltered;
};


