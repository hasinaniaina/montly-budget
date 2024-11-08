import { ViewStyle } from "react-native";
import {
  Category,
  CreationCategory,
  CreationProduct,
  Product,
} from "./interface";
import {
  removeCategory,
  removeProduct,
  retrieveUserCategory,
} from "./Controller";


export const checkIfCategorylabelAlreadyStored = async (datas: Category) => {
  const userCategories = await retrieveUserCategory();

  let isCategoryLabelNotExist = true;

  const label = datas.label;

  let dateCreated = new Date().toISOString().split("T")[0].split("-");

  const dateCreatedFormated = dateCreated[1] + "-" + dateCreated[0];

  //  Check if category exist on database
  userCategories.forEach((userCategory: Category | CreationCategory) => {
    let dateCategoryStoredCreated = new Date(
      (userCategory as CreationCategory).createdDate!
    )
      .toISOString()
      .split("T")[0]
      .split("-");

    let dateCategoryStoredCreatedFormated =
      dateCategoryStoredCreated[1] + "-" + dateCategoryStoredCreated[0];

    if (
      (userCategory as Category).label?.toLocaleLowerCase() ===
      label?.toLocaleLowerCase()
    ) {
      if (dateCategoryStoredCreatedFormated === dateCreatedFormated) {
        isCategoryLabelNotExist = false;
      }
    }
  });

  return isCategoryLabelNotExist;
};

// export const checkIfProductCategoryExistAndAmountNotLessProduct = async (
//   datas: Category & CreationCategory
// ) => {
//   const products = await getProductByIdCreationCategory(datas.idCreationCategory);
//   let productTotalAmount = 0;

//   for (let product of products) {
//     productTotalAmount += product.productAmount;
//   }
  

//   if (datas.categoryIncome < productTotalAmount) {
//     return {notLess: false, amount: productTotalAmount};
//   }

//   return {notLess: true};
// };

export const isFilteredActivate = (
  isCategoryFiltered: boolean[],
  index: number,
  value: boolean
) => {
  let isFiltered = [...isCategoryFiltered!];
  isFiltered[index] = true;
  return isFiltered;
};

export const categoryDataInit = {
  idCategory: -1,
  color: "#000",
  label: "",
  idCreationCategory: -1,
  categoryIncome: 0,
  idUser: 1,
};
