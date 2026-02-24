import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { GloblalStyles } from "@/constants/GlobalStyles";
import {
  useIncomeStore,
  usePopupStore,
} from "@/constants/store";
import {
  sortedArrayIncome,
} from "@/constants/utils";
import {
  createIncome,
  editIncome,
  removeIncome,
} from "@/constants/Controller";
import {
  Category,
  CreationCategory,
  Income,
} from "@/constants/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import { red } from "@/constants/Colors";

export default function AddIncomeInput() {
  const singleIncomeData = useIncomeStore(
    (state) => state.singleIncomeData,
  );
  const setSingleIncomeData = useIncomeStore(
    (state) => state.setSingleIncomeData,
  );

  const popupActionType = usePopupStore((state) => state.actionType);

  const currentIncomeDatas = useIncomeStore(
    (state) => state.income,
  );

  const setCurrentIncomeDatas = useIncomeStore(
    (state) => state.setIncome,
  );

  const setPopupVisible = usePopupStore((state) => state.setVisible);

  const [loading, setLoading] = useState<boolean>(false);

  const dataAdded: (Category & CreationCategory)[] = [];

  const addIncome = async (): Promise<boolean> => {
    let inputNotEmpty = checkInputsEmpty(singleIncomeData!);

    if (inputNotEmpty) {
        const uuidIncome = crypto.randomUUID();
        const result = await createIncome(
          singleIncomeData!,
          uuidIncome,
        );

        const currentIncomeDatasTmp = currentIncomeDatas ?[...currentIncomeDatas] : [];

        const newCurrentIncomeData: Income = {
        idIncome: uuidIncome,
          label: singleIncomeData?.label!,
          amount: singleIncomeData?.amount!,
          createdDate: new Date()
        };

        currentIncomeDatasTmp.push(newCurrentIncomeData);
        const currentIncomeSorted = sortedArrayIncome(currentIncomeDatasTmp);
        setCurrentIncomeDatas(currentIncomeSorted);

        if (result) {
          Toast.show({
            type: "success",
            text1: "Income inserted!!!",
          });
          setSingleIncomeData(null);

          return true;
        } else {
          const currentIncomeSortedDontDelete =
            currentIncomeSorted.filter(
              (item) => item.idIncome !== uuidIncome,
            );

          setCurrentIncomeDatas(currentIncomeSortedDontDelete);

          Toast.show({
            type: "error",
            text1: "Something went wrong!!!",
          });
          return true;
        }
    } else {
      Toast.show({
        type: "error",
        text1: "Inputs should not be empty!!!",
      });
      return true;
    }
  };

  const updateIncome = async (): Promise<boolean> => {
    const inputNotEmpty = checkInputsEmpty(singleIncomeData!);

    if (inputNotEmpty) {
      const result = await editIncome(singleIncomeData!);

      if (result) {
        const IncomeUpdated = [...currentIncomeDatas];
        IncomeUpdated.map((income, index) => {
          if (income.idIncome == singleIncomeData?.idIncome) {
            ((IncomeUpdated[index].amount = singleIncomeData.amount),
              (IncomeUpdated[index].label = singleIncomeData.label));
          }
        });
        setCurrentIncomeDatas(IncomeUpdated);
        setSingleIncomeData(null);
        setPopupVisible(false);

        return true;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const checkInputsEmpty = (
    singleIncomeData: Income,
  ) => {
    let error = false;

    if (singleIncomeData) {
      if (!singleIncomeData.label || singleIncomeData.label == "") {
        error = true;
      }

      if (!singleIncomeData.amount || singleIncomeData.amount == null) {
        error = true;
      }
    } else {
      error = true;
    }

    if (error) {
      Toast.show({
        type: "error",
        text1: "Inputs should not be empty!!!",
      });
      return false;
    } else {
      return true;
    }
  };

  const remove = async (): Promise<boolean> => {
    const result = await removeIncome(
      singleIncomeData?.idIncome!,
    );

    const newCurrentIncomeDatas = currentIncomeDatas.filter(
      (item) => item.idIncome !== singleIncomeData?.idIncome,
    );

    setCurrentIncomeDatas(newCurrentIncomeDatas);

    if (result) {
      Toast.show({
        type: "success",
        text1: "Income Deleted!!!",
      });

      const timeOut = setTimeout(() => {
        setPopupVisible(false);
      }, 1000);
      return true;
    } else {
      Toast.show({
        type: "error",
        text1: "Something went wrong!!!",
      });

      return false;
    }
  };

  return (
    <View>
      <View style={{ alignItems: "center" }}>
        <View style={GloblalStyles.popupLabelInput}>

            <Text style={GloblalStyles.appLabel}>Label</Text>
          <View style={GloblalStyles.appInput}>
            <TextInput
              placeholder="Bank.."
              value={singleIncomeData?.label}
              onChangeText={(val) => {
                let dataTmp = { ...singleIncomeData! };
                dataTmp.label = val;
                setSingleIncomeData(dataTmp);
              }}
            />
          </View>
        </View>
        <View style={GloblalStyles.popupLabelInput}>
            <Text style={GloblalStyles.appLabel}>Amount</Text>
          <View style={GloblalStyles.appInput}>
            <TextInput
              placeholder="100.000..."
              keyboardType="numeric"
              value={singleIncomeData?.amount ? String(singleIncomeData?.amount) : ""}
              onChangeText={(val) => {
                let dataTmp = { ...singleIncomeData! };
                dataTmp.amount = Number(val);
                setSingleIncomeData(dataTmp);
              }}
            />
          </View>
        </View>
        {popupActionType == "insert" ? (
          <TouchableOpacity
            style={[GloblalStyles.popupButton]}
            onPress={async () => {
              setLoading(true);
              const result = await addIncome();
              if (result) {
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Text style={GloblalStyles.popupButtonTitle}>Add</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={GloblalStyles.deleteButtonAndActionButtonContainer}>
            <TouchableOpacity
              style={[GloblalStyles.popupButton]}
              onPress={async () => {
                setLoading(true);
                const result = await updateIncome();
                if (result) {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text style={GloblalStyles.popupButtonTitle}>Update</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={GloblalStyles.deleteIconContainer}
              onPress={async () => {
                setLoading(true);
                const result = await remove();
                if (result) {
                  setLoading(false);
                }
              }}
            >
              <Ionicons name="trash-outline" size={30} color={red} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Toast position="bottom" visibilityTime={2000} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPopupContainer: {
    flexDirection: "row",
  },
});
