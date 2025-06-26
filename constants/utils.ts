import {
  Category,
  CreationCategory,
  CsvDatas,
  ExportDatas,
  CsvDataType,
} from "./interface";
import { retrieveUserCategory, getDatabaseDatas } from "./Controller";

import { Alert } from "react-native";

import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  insertCSVIntoCategoryDatabase,
  insertCSVIntoProductDatabase,
} from "./db";

const header = `Category,Category color,created date, Product, Product color, Product amount,Product coefficient, Product created date `;

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
  idCategory: "",
  color: "#000",
  label: "",
  idCreationCategory: "",
  categoryIncome: 0,
  idUser: "",
};

export const productDataInit = {
  idProduct: "",
  designation: "",
  color: "#000",
  idCreationProduct: "",
  productAmount: 0,
  productCoefficient: 1,
  idCreationCategory: "",
};

// Convertir les données en format CSV
export const generateCSV = (datas: ExportDatas[]) => {
  let rows = "";

  datas.map((itemCategory) => {
    rows += `${itemCategory.label}, ${itemCategory.color}, ${itemCategory.createdDate},`;
    let count = 0;
    itemCategory.products.map((itemProduct) => {
      if (count >= 1) rows += `${""}, ${""}, ${""},`;

      rows += ` ${itemProduct.designation.replaceAll(",", "/")}, ${
        itemProduct.color
      }, ${itemProduct.productAmount}, ${itemProduct.productCoefficient}, ${
        itemProduct.createdDate
      }${"\n"}`;

      count++;
    });
  });

  return [header, rows].join("\n");
};

export const exportCSV = async () => {
  const datas = await getDatasFromDatabaseToExport();

  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
    Alert.alert("Permission refusée");
    return;
  }

  const directoryUri = permissions.directoryUri;

  const csvContent = generateCSV(datas);

  const fileName = "Monthly-budget.csv";
  const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
    directoryUri,
    fileName,
    "csv"
  );

  try {
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    Alert.alert("Succès", "Le fichier CSV a été créé.");
  } catch (err) {
    console.error(err);
    Alert.alert("Erreur", "Impossible d'exporter le fichier CSV.");
  }
};

const getDatasFromDatabaseToExport = async () => {
  const datas = await getDatabaseDatas();
  return datas;
};

export const importCSV = async () => {
  const csvLines = [];

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    const fileUri = result.assets?.[0]?.uri;

    if (!fileUri) {
      Alert.alert("Erreur", "Impossible de lire le fichier.");
      return;
    }

    const content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Découper par lignes et ignorer les lignes vides
    const lines = content.split(/\r?\n/).filter((line) => line);
    lines.splice(0, 1);

    const datas = formatCSVForDatabase(lines);

    await insertCSVIntoDatabase(datas);
  } catch (error) {
    console.error("Erreur lors de l’importation :", error);
    Alert.alert("Erreur", "Échec de l’importation du fichier.");
  }
};

const formatCSVForDatabase = (lines: string[]): CsvDatas => {
  const categoryDatas = [] as Array<CsvDataType>;
  const productDatas = [] as Array<Array<CsvDataType>>;

  let findCategoryLine = true;
  let count2 = 0;
  const headerIndex = header.split(",");

  lines.map((line) => {
    const linesSplited = line.split(",");
    let countItem = 0;
    const categoryDatasTmp: CsvDataType = {};
    const productDatasTmp: CsvDataType = {};

    linesSplited.map((lineSplited) => {
      let indexOfArray = toCamelCase(headerIndex[countItem]);

      if (lineSplited.length != 0 && lineSplited != " ") {
        if (countItem > 2) {
          if (!productDatasTmp[indexOfArray]) {
            productDatasTmp[indexOfArray] = "";
          }

          productDatasTmp[indexOfArray] = lineSplited;
          findCategoryLine = true;
        } else {
          if (!categoryDatasTmp[indexOfArray]) {
            categoryDatasTmp[indexOfArray] = "";
          }

          categoryDatasTmp[indexOfArray] = lineSplited;

          if (findCategoryLine) {
            count2++;
            findCategoryLine = false;
          }
        }
      } else {
        findCategoryLine = false;
      }

      countItem++;
    });

    if (Object.keys(categoryDatasTmp).length) {
      categoryDatas.push(categoryDatasTmp);
    }

    if (!productDatas[count2 - 1]) {
      productDatas[count2 - 1] = [];
    }

    if (Object.keys(productDatasTmp).length) {
      productDatas[count2 - 1].push(productDatasTmp);
    }
  });

  return {
    categoryDatas: categoryDatas,
    productDatas: productDatas,
  };
};

const insertCSVIntoDatabase = async (datas: CsvDatas) => {
  const user: any = await AsyncStorage.getItem("userCredentials");
  const categories = datas.categoryDatas;
  const products = datas.productDatas;

  categories.map(async (category, index) => {
    const idCreationCategory = await insertCSVIntoCategoryDatabase(
      category,
      JSON.parse(user)
    );

    products[index].map(async (product) => {
      await insertCSVIntoProductDatabase(product, idCreationCategory);
    });
  });
};

const toCamelCase = (str: string): string => {
  const words = str.trim().split(/\s+/); // sépare par espace(s)

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower; // 1er mot : tout en minuscule
      return lower.charAt(0).toUpperCase() + lower.slice(1); // suivant : majuscule 1ère lettre
    })
    .join("");
};
