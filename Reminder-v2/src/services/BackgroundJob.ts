import BackgroundFetch from "react-native-background-fetch";

import { aDay, defaultSettings, locale } from "../constants/settings";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Vehicle } from "../types";
import { Database } from "../database/Database";
import { UpLoadBackup } from "./GoogleDriveBackup";

BackgroundFetch.finish("com.reminder.smsautosend");
BackgroundFetch.stop("com.reminder.smsautosend");

// Constants
const db = Database.getInstance();

const sendSMS = (vehicules: Vehicle[], smsModel: string, num_days: number) => {
  for (const vehicule of vehicules) {
    // TODO: Add the SMS API
    console.info("Send reminder SMS to", vehicule.client.name);
    if (vehicule.count)
      db.updateCounts({
        vehicle_id: vehicule.id,
        count: vehicule.count + 1,
      });
  }
};

const task = async () => {
  /**
   * create the task to run in the background
   */
  console.debug("From the background service");

  let _settings = await AsyncStorage.getItem("Settings");
  let settings = defaultSettings;
  if (_settings) settings = JSON.parse(_settings);

  // Upload a backup image
  try {
    AsyncStorage.getItem("LastBackupDate", async (e, date) => {
      const today = new Date();
      if (date) {
        const lastDate = new Date(date);
        const diffDays = Math.floor(
          (today.getMilliseconds() - lastDate.getMilliseconds()) / aDay
        );
        if (
          settings.enabledBackup &&
          diffDays >= parseInt(settings.backupPeriod.id)
        ) {
          UpLoadBackup();
        }
      } else AsyncStorage.setItem("LastBackupDate", today.toString());
    });
  } catch (error: any) {
    console.error(error.message);
  }

  try {
    await new Promise(async () => {
      try {
        AsyncStorage.getItem("LastSentDate", (e, r) => {
          if (r) {
            // Return if the LastSentDate is today
            if (new Date(r).getDate() === new Date().getDate()) {
              return;
            }
          }
          try {
            if (!settings.enabledSMS) return;

            // extract seding time from settings
            const time = new Date(settings.time);

            // constinue if the current time is the time specified in the settings
            if (new Date().getHours() >= time.getHours()) {
              // Send SMS to all deadline after the specified periods
              for (const p of settings.smsPeriods) {
                // get the day before a period
                const beforeDeadlineByPeriod = new Date(
                  new Date().getTime() + aDay * parseInt(p.id)
                );
                // Deadline reminder
                db.getVehiclesByDeadline(
                  beforeDeadlineByPeriod.toLocaleDateString(locale),
                  (vehicules: Vehicle[]) =>
                    sendSMS(vehicules, settings.smsModel, parseInt(p.id))
                );
              }
            }
          } catch (e) {
            console.log(e);
          }
        });
        const lastRemainSentDate = await AsyncStorage.getItem(
          "LastRemainSentDate"
        );
        // Remain Deadline reminder
        if (
          !lastRemainSentDate ||
          new Date(lastRemainSentDate).getDate() !== new Date().getDate()
        ) {
          db.getVehiclesByRemainDeadline(
            new Date().toLocaleDateString(locale),
            (vehicules: Vehicle[]) =>
              sendSMS(vehicules, settings.remainSmsModel, 0)
          );
        }
      } catch (error) {
        console.error(error);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

// And with with #scheduleTask
let MyHeadlessTask = async (event: any) => {
  // Get task id from event {}:
  let taskId = event.taskId;
  console.log(taskId);
  let isTimeout = event.timeout; // <-- true when your background-time has expired.
  if (isTimeout) {
    BackgroundFetch.finish(taskId);
    return;
  }

  // Execute task
  await task();
  BackgroundFetch.finish(taskId);
};

BackgroundFetch.scheduleTask({
  enableHeadless: true,
  taskId: "com.reminder.smsautosend",
  stopOnTerminate: false,
  requiresBatteryNotLow: false,
  requiresCharging: false,
  requiresDeviceIdle: false,
  requiresStorageNotLow: false,
  startOnBoot: true,
  forceAlarmManager: true,
  periodic: true,
  delay: 500,
});

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

BackgroundFetch.start();
