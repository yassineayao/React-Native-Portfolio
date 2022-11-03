import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  GDrive,
  MimeTypes,
} from "@robinbobin/react-native-google-drive-api-wrapper";
import { ToastAndroid } from "react-native";

import * as RNFS from "expo-file-system";
import { backup_names, DBname, settingsDBName } from "../constants/settings";
import i18n from "./i18n";

const path = `${RNFS.documentDirectory}SQLite/`;

const getBackupDBFileID = async (filename: string, gdrive: GDrive) => {
  let id = null;
  try {
    if (!gdrive) {
      gdrive = new GDrive();
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    }
    let list = await gdrive.files.list();
    for (const file of list.files) {
      if (file.name === filename) {
        id = file.id;
      }
    }
  } catch (error: any) {
    console.log(error.message);
  }
  return id;
};

const UpLoadBackup = async () => {
  // If not signed in just return
  if (!(await GoogleSignin.isSignedIn())) return;

  const gdrive = new GDrive();
  try {
    const files = await RNFS.readDirectoryAsync(path);
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    for (const file of files) {
      if (file === DBname || file == settingsDBName) {
        const fileContent = await RNFS.readAsStringAsync(`${path}${file}`, {
          encoding: "base64",
        });
        const id = await getBackupDBFileID(backup_names[file], gdrive);
        let res;
        try {
          if (id)
            res = await gdrive.files
              .newResumableUploader()
              .setData(fileContent, MimeTypes.BINARY)
              .setIdOfFileToUpdate(id)
              .setRequestBody({
                name: backup_names[file],
              })
              .execute()
              .then((res) => {
                if (res.isComplete) {
                  console.log("Update LastBackupDate");
                  AsyncStorage.setItem("LastBackupDate", new Date().toString());
                }
              });
          else {
            res = await gdrive.files
              .newResumableUploader()
              .setData(fileContent, MimeTypes.BINARY)
              .setRequestBody({
                name: backup_names[file],
              })
              .execute()
              .then((res) => {
                if (res.isComplete) {
                  console.log("Update LastBackupDate");
                  AsyncStorage.setItem("LastBackupDate", new Date().toString());
                }
              });
          }
        } catch (err: any) {
          console.error(err.message);
        }
      }
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

const DownloadBackup = async () => {
  console.log("DownloadBackup");
  const gdrive = new GDrive();
  try {
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    const keys = Object.keys(backup_names) as [keyof typeof backup_names];
    for (const filename of keys) {
      const fileId = await getBackupDBFileID(backup_names[filename], gdrive);
      if (!fileId) {
        if (filename === DBname)
          ToastAndroid.show(
            i18n.t("downloadbackup_error_fileNotFound"),
            ToastAndroid.LONG
          );
        continue;
      }
      const backupDBFileContent = await gdrive.files.getText(fileId);
      await RNFS.writeAsStringAsync(`${path}${filename}`, backupDBFileContent, {
        encoding: "base64",
      });
    }
  } catch (err: any) {
    console.log(err);
    if (err.message == "Network request failed")
      ToastAndroid.show(
        i18n.t("downloadbackup_error_network"),
        ToastAndroid.LONG
      );
    else ToastAndroid.show(i18n.t("downloadbackup_error"), ToastAndroid.LONG);
  }
};

export { DownloadBackup, UpLoadBackup, getBackupDBFileID };
