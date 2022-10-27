import { I18n } from "i18n-js";
import ar from "../lang/ar.json";
import fr from "../lang/fr.json";

const translation = {
  ar: ar.translation,
  fr: fr.translation,
};
const i18n = new I18n(translation);
i18n.enableFallback = true;
i18n.locale = "ar";

export default i18n;
