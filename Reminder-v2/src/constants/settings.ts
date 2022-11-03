import { Dimensions } from "react-native";
import { SelectboxListItem } from "../types";

const DBname = "mainDB";
const settingsDBName = "RKStorage";
const backup_names = {
  [DBname]: `${DBname}_WBTY8VAyA6Yr2GJC05pI`,
  [settingsDBName]: `${settingsDBName}_WBTY8VAyA6Yr2GJC05pI`,
};

const aDay = 86400000; // 24h in seconds
const maxDemoSMS = 30; // The maximum number of SMS to send for the demo mode
const { width, height } = Dimensions.get("window");

const locale = "fr-fr";

const defaultSettings = {
  enabledSMS: true,
  time: "2022-08-25T19:00:00.501Z",
  smsModel: `السلام عليكم [اسم], نعلمك أن التأمين الخاص بك سينتهي خلال [عدد_الايام] أيام. يرجى الاتصال بنا للتجديد.`,
  remainSmsModel: `السلام عيكم و رحمة الله تعالى و بركاته`,
  smsPeriods: [
    { id: "1", item: "1" },
    { id: "3", item: "3" },
    { id: "7", item: "7" },
  ] as SelectboxListItem[],
  enabledBackup: false,
  backupPeriod: { id: "7", item: "7" } as SelectboxListItem,
};

export {
  DBname,
  settingsDBName,
  backup_names,
  width,
  height,
  aDay,
  maxDemoSMS,
  defaultSettings,
  locale,
};
