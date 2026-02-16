import {
  Category,
  CreationCategory,
  CsvDatas,
  ExportDatas,
  CsvDataType,
  Product,
  CreationProduct,
  Resume,
} from "./interface";
import { getDatabaseDatas, retrieveCurrentUserCategory } from "./Controller";

import { Alert } from "react-native";

import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  insertCSVIntoCategoryDatabase,
  insertCSVIntoProductDatabase,
} from "./db";
import { Item } from "react-native-picker-select";
import { MONTH } from "./constant";

const header = `Category,Category color,created date, Product, Product color, Product amount,Product coefficient, Product created date `;

export const checkIfCategorylabelAlreadyStored = async (
  datas: Category,
  categories: (Category & CreationCategory)[],
) => {
  let isCategoryLabelExist = false;

  const label = datas.label;

  //  Check if category exist on database
  categories.forEach((category) => {
    if (category.label?.toLocaleLowerCase() === label?.toLocaleLowerCase()) {
      isCategoryLabelExist = true;
    }
  });

  return isCategoryLabelExist;
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
  value: boolean,
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
    "csv",
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
      JSON.parse(user),
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

export const getCategoriesForRNPickerSelect = (category: Category[]) => {
  let categoryCount = 0;
  let categoryTmp: Item[] = [];

  while (categoryCount < category.length) {
    categoryTmp.push({
      label: category[categoryCount].label!,
      value: category[categoryCount]!,
    });

    categoryCount += 1;
  }

  return categoryTmp;
};

export const getCategoryTransactionNumber = async (
  categories: (Category & CreationCategory)[],
  productByCategory: (Product & CreationProduct)[],
) => {
  let categoryCount = 0;
  let sumExpensiveTmp = 0;
  let transactionNumberCategoriesTmp = [];

  while (categoryCount < categories.length) {
    let transactionNumber = 0;
    let productCount = 0;

    while (productCount < productByCategory.length) {
      if (
        productByCategory[productCount].idCreationCategory ==
        categories[categoryCount].idCreationCategory
      ) {
        sumExpensiveTmp += transactionNumber += 1;
      }
      productCount++;
    }
    transactionNumberCategoriesTmp.push(transactionNumber);
    categoryCount++;
  }

  return transactionNumberCategoriesTmp;
};

export const numStr = (a: string, b: string) => {
  a = "" + a;
  b = b || " ";
  var c = "",
    d = 0;
  while (a.match(/^0[0-9]/)) {
    a = a.substr(1);
  }
  for (var i = a.length - 1; i >= 0; i--) {
    c = d != 0 && d % 3 == 0 ? a[i] + b + c : a[i] + c;
    d++;
  }
  return c;
};

export const retrieveFirstAndLastDay = (
  currentDate: string,
  optional?: boolean,
) => {
  // Retrieve Category date filter
  const currentDateTmp = new Date(currentDate);

  const firstDay = new Date(
    currentDateTmp.getFullYear(),
    currentDateTmp.getMonth(),
    1,
  );
  const lastDay = new Date(
    currentDateTmp.getFullYear(),
    currentDateTmp.getMonth() + 1,
    0,
  );

  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay),
  };
};

const formatDate = (date: Date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const formatNewDateIncrease = (date: string) => {
  const newDate = new Date(date);
  newDate.setMonth(new Date(date).getMonth() + 1);

  return newDate;
};

export const formatNewDateDecrease = (date: string) => {
  const newDate = new Date(date);
  newDate.setMonth(new Date(date).getMonth() - 1);

  return newDate;
};

export const getCategorieDependToDate = (
  categories: (Category & CreationCategory)[],
  dateFilter: string[],
  categorySearch?: string,
  searchInDateOrCategorySearch?: "date" | "categorySearch",
): (Category & CreationCategory)[] => {
  const firstDateFilter = new Date(dateFilter[0]);
  const lastDateFilter = new Date(dateFilter[1]);
  const newCategory: (Category & CreationCategory)[] = [];

  let categoryDependToCategorySearch: (Category & CreationCategory)[] =
    categories;

  if (searchInDateOrCategorySearch == "date") {
    categoryDependToCategorySearch =
      categorySearch != ""
        ? getCategorieDependToCategorieSearch(
            categories,
            categorySearch!,
            dateFilter,
            searchInDateOrCategorySearch,
          )
        : categories;
  }

  categoryDependToCategorySearch.map((category, index) => {
    const categoryDateStoreSplited = String(category.createdDate).split(" ")[0];
    const newCategoryDateStore = new Date(categoryDateStoreSplited);

    if (
      newCategoryDateStore >= firstDateFilter &&
      newCategoryDateStore <= lastDateFilter
    ) {
      newCategory.push(categories[index]);
    }
  });

  return newCategory;
};

export const getCategorieDependToCategorieSearch = (
  categories: (Category & CreationCategory)[],
  categorySearch: string,
  dateFilter: string[],
  searchInDateOrCategorySearch: "date" | "categorySearch",
): (Category & CreationCategory)[] => {
  const newCategory: (Category & CreationCategory)[] = [];

  let categorySearchTmp: (Category & CreationCategory)[] = categories;

  // if (searchInDateOrCategorySearch == "categorySearch") {
  //   categorySearchTmp = getCategorieDependToDate(
  //     categories,
  //     dateFilter,
  //     categorySearch,
  //     searchInDateOrCategorySearch,
  //   );
  // }

  categorySearchTmp.map((category, index) => {
    if (
      category.label
        .toLocaleLowerCase()
        .startsWith(categorySearch.toLocaleLowerCase())
    ) {
      newCategory.push(categorySearchTmp[index]);
    }
  });

  const newCategorySorted = sortedArray(newCategory);

  return newCategorySorted;
};

// ========================================================

export const getExpensesDependToDate = (
  expenses: (Product & CreationProduct)[],
  dateFilter: string[],
  expensesSearch?: string,
  searchInDateOrExpensesSearch?: "date" | "expensesSearch",
): (Product & CreationProduct)[] => {
  const firstDateFilter = new Date(dateFilter[0]);
  const lastDateFilter = new Date(dateFilter[1]);
  const newExpenses: (Product & CreationProduct)[] = [];

  let expensesDependToExpensesSearch: (Product & CreationProduct)[] = expenses;

  if (searchInDateOrExpensesSearch == "date") {
    expensesDependToExpensesSearch =
      expensesSearch != ""
        ? getExpensesDependToExpensesSearch(
            expenses,
            expensesSearch!,
            dateFilter,
            searchInDateOrExpensesSearch,
          )
        : expenses;
  }

  expensesDependToExpensesSearch.map((expense, index) => {
    const expenseDateStoreSplited = String(expense.createdDate).split(" ")[0];
    const newExpenseDateStore = new Date(expenseDateStoreSplited);

    if (
      newExpenseDateStore >= firstDateFilter &&
      newExpenseDateStore <= lastDateFilter
    ) {
      newExpenses.push(expenses[index]);
    }
  });

  return newExpenses;
};

export const getExpensesDependToExpensesSearch = (
  expenses: (Product & CreationProduct)[],
  expensesSearch: string,
  dateFilter: string[],
  searchInDateOrExpensesSearch: "date" | "expensesSearch",
): (Product & CreationProduct)[] => {
  const newExpense: (Product & CreationProduct)[] = [];

  let expensesSearchTmp: (Product & CreationProduct)[] = expenses;  

  if (searchInDateOrExpensesSearch == "expensesSearch") {
    expensesSearchTmp = getExpensesDependToDate(
      expenses,
      dateFilter,
      expensesSearch,
      searchInDateOrExpensesSearch,
    );
  }

  expensesSearchTmp.map((expense, index) => {
    if (
      expense.designation
        .toLocaleLowerCase()
        .startsWith(expensesSearch.toLocaleLowerCase())
    ) {
      newExpense.push(expensesSearchTmp[index]);
    }
  });

  const newExpensesSorted = sortedArrayExpenses(newExpense);

  return newExpensesSorted;
};

export const sortedArray = (
  value: (Category & CreationCategory)[]
) => {
  const valueSorted = [...value].sort(
    (a, b) =>
      new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime(),
  );

  return valueSorted;
};

export const sortedArrayExpenses = (
  value:(Product & CreationProduct)[]
) => {
  const valueSorted = [...value].sort(
    (a, b) =>
      new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime(),
  );

  return valueSorted;
};

export const prettyLog = (variable: any, caractere?: string) => {
  console.log(caractere, JSON.stringify(variable, null, "\t"));
};

export const getValueForBarChart = (
  categories: (Category & CreationCategory)[],
  products: (Product & CreationProduct)[],
) => {
  let barChartValue: { value: number; label: string }[] | [] = [];

  if (categories) {
    MONTH.map((month, indexMonth) => {
      let sumProductForEachCategory: number = 0;

      categories.map((category) => {
        const categoryMonthIndex = new Date(category.createdDate!).getMonth();

        if (indexMonth == categoryMonthIndex) {
          products.map((product) => {
            if (product.idCreationCategory == category.idCreationCategory) {
              sumProductForEachCategory += product.productAmount;
            }
          });
        }
      });

      barChartValue[indexMonth] = {
        ...barChartValue[indexMonth],
        label: month,
        value: sumProductForEachCategory,
      };
    });
  }
  return barChartValue;
};
