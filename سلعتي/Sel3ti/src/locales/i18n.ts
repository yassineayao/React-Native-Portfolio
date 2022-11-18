import { I18n } from "i18n-js";

import ar from "./ar.json";
import en from "./en.json";

const translation = {
  ar: ar.translation,
  en: en.translation,
};
const i18n = new I18n(translation);
i18n.enableFallback = true;
i18n.locale = "en";

export default i18n;
