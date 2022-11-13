/**
 * File: Server.js
 * Description: Contains all functions handles with the server side via APIs
 */
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DomainName } from "../constants/settings";
// import {
//   deleteOrders,
//   isInvoiceExist,
//   saveInvoices,
//   updateOrder,
// } from "../data/helpers";
import _ from "lodash";
import i18n from "../locales/i18n";
import { TProduct } from "../types";

export const isResponseOk = (response: Response) => {
  /**
   * Hanlde server responses
   */
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  } else {
    throw Error(response.statusText);
  }
};

export function LoadProducts(
  setProducts: Function,
  products: TProduct[],
  category: string,
  family: string | null,
  page: number,
  setPage: Function,
  setLoadingProducts: Function,
  // setIsBanned: Function | null = null,
  isNewCategory = false,
  search: string | null = null
) {
  /**
   * Load products from the server side
   * @param setProducts hooks function to update the products state
   * @param products current products state
   * @param category the current selected category
   * @param page the current page number
   * @param setPage hooks function to update the page state
   * @param setLoadingProducts hooks function to update the loading state
  //  * @param setIsBanned hooks function to update the ban state
   * @param isNewCategory indicator used to decide to clear the current products or not
   * @param search contains the search text if not null.
   */
  try {
    AsyncStorage?.getItem("token", (e, r) => {
      if (r && r.length > 0) {
        if (category !== undefined)
          fetch(
            DomainName +
              `/api/products/?category=${category}&family=${family}&page=${
                page - 1
              }&search=${search ? search.toLowerCase() : search}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "jwt " + r,
              },
            }
          )
            .then((res) => res?.json())
            .then((res) => {
              if (res !== undefined && res?.length > 0) {
                if (setProducts !== undefined) {
                  if (isNewCategory) setProducts(res);
                  else {
                    setProducts(_.unionBy(products, res, "id"));
                  }
                  console.log(res[0])
                }
                if (setPage !== undefined) setPage(page + 1);
              // } else if (res !== undefined && setIsBanned) {
                // setIsBanned(res.length === 0);
              }
              if (setLoadingProducts !== undefined) setLoadingProducts(false);
            })
            .catch((error) => {
              console.log(error);
              ToastAndroid.show(
                i18n.t("connection_error_msg"),
                ToastAndroid.LONG
              );
              setLoadingProducts(false);
            });
      } else {
        console.log("No token");
      }
    });
  } catch (e) {
    console.log(e);
  }
}

export function loadFamilies(
  setFamilies: Function,
  products: TProduct[],
  category: string,
  page: number,
  setPage: Function,
  setLoadingFamilies: Function,
  isNewCategory: boolean = false,
  search: string | null = null
) {
  /**
   * Load products from the server side
   * @param setFamilies hooks function to update the families state
   * @param products current products state
   * @param category the current selected category
   * @param page the current page number
   * @param setPage hooks funstepction to update the page state
   * @param setLoadingFamilies hooks function to update the loading state
   * @param isNewCategory indicator used to decide to clear the current products or not
   * @param search contains the search text if not null.
   */
  try {
    AsyncStorage?.getItem("token", (e, r) => {
      if (r && r.length > 0) {
        if (category !== undefined)
          fetch(
            `${DomainName}/api/families/?category=${category}&page=${
              page - 1
            }&search=${search ? search.toLowerCase() : search}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "jwt " + r,
              },
            }
          )
            .then((res) => res?.json())
            .then((res) => {
              if (res !== undefined && res?.length > 0) {
                if (setFamilies !== undefined) {
                  if (isNewCategory) setFamilies(res);
                  else {
                    setFamilies(_.unionBy(products, res, "id"));
                  }
                }
                if (setPage !== undefined) setPage(page + 1);
              }
              if (setLoadingFamilies !== undefined) setLoadingFamilies(false);
            })
            .catch((error) => {
              console.log(error);
              ToastAndroid.show(
                i18n.t("connection_error_msg"),
                ToastAndroid.LONG
              );
              setLoadingFamilies(false);
            });
      } else {
        console.log("No token");
      }
    });
  } catch (e) {
    console.log(e);
  }
}

export function LoadCategories(
  setCategories: Function,
  setLoadingProducts: Function,
  setIsBanned: Function | null = null,
  promotion = false
) {
  /**
   * Load list of existing categories
   * @param setCategories hook function to update the categories state
   * @param setLoadingProducts hooks function to update the loading state
   * @param setIsBanned hooks function to update the ban state
   */
  try {
    AsyncStorage.getItem("token", (e, r) => {
      if (r && r.length > 0) {
        fetch(`${DomainName}/api/categories/?promotion=${promotion}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "jwt " + r,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            try {
              if (res !== undefined && setIsBanned)
                setIsBanned(res.length === 0);
              setCategories(res);
              setLoadingProducts(false);
            } catch (error) {
              console.log(error);
            }
          })
          .catch((error) => {
            console.log("--------------------------------------------------");
            console.log(error);
            console.log("--------------------------------------------------");
            ToastAndroid.show(
              i18n.t("connection_error_msg"),
              ToastAndroid.LONG
            );
            setLoadingProducts(false);
          });
      } else {
        console.log("No token");
      }
    });
  } catch (e) {
    console.log(e);
  }
}