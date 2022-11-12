/**
 * File: settings.js
 * Description: contanis the constants settings variables
 */

import { I18nManager } from "react-native";

export const forceRTL = () => {
  // Force Right to Left layout
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  I18nManager.swapLeftAndRightInRTL(true);
};

// TODO: Update the domain name
// export const DomainName = "https://belgro.herokuapp.com"; // Backend URL
export const DomainName = "http://10.0.2.2:8000"; // Backend URL

// TODO: Delete the line bellow if not used any where
export const ProductContainerSize = { width: 75, height: 75 };

export const language = "ar"; // App language

export const TIMBER = 0.0025; // Tax
