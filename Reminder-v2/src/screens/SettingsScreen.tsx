import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Button,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectBox from "react-native-multi-selectbox";
import { ArrowUturnLeftIcon as ResetIcon } from "react-native-heroicons/outline";
import i18n from "../services/i18n";
import { customTheme } from "../constants/theme";
import { defaultSettings } from "../constants/settings";
import CardContainer from "../components/CardContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectboxListItem } from "../types";

const SettingsScreen = () => {
  const [editSendingTime, setEditSendingTime] = useState<boolean>(false);
  const [settings, setSettings] = useState(defaultSettings);

  useLayoutEffect(() => {
    UpdateSettings();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("Settings", JSON.stringify(settings));
  }, [settings]);

  const UpdateSettings = async () => {
    let _settings = await AsyncStorage.getItem("Settings");
    if (_settings) {
      setSettings(JSON.parse(_settings));
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        marginTop: 8,
        paddingBottom: 16,
        backgroundColor: customTheme.colors.containerBackground,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="font-bold text-3xl text-center">{i18n.t("sms")}</Text>
      <CardContainer
        _className={`flex-row ${
          i18n.locale === "ar" ? "flex-row-reverse" : ""
        } justify-between`}
      >
        <Text>{i18n.t("enable")}</Text>
        <View className={`${i18n.locale === "ar" ? "rotate-180" : ""}`}>
          <Switch
            trackColor={{
              false: customTheme.colors.disable,
              true: customTheme.colors.headerBackground,
            }}
            thumbColor={
              settings.enabledSMS
                ? customTheme.colors.headerBackground
                : customTheme.colors.disable
            }
            value={settings.enabledSMS}
            style={{
              height: 20,
            }}
            onValueChange={(value: boolean) => {
              setSettings({ ...settings, enabledSMS: value });
            }}
          />
        </View>
      </CardContainer>

      <CardContainer
        _className={`flex-row ${
          i18n.locale === "ar" ? "flex-row-reverse" : ""
        } justify-between`}
      >
        <Text>{i18n.t("time")}</Text>
        <TouchableOpacity
          onPress={() => {
            setEditSendingTime(true);
          }}
          style={{
            flex: 1,
          }}
        >
          <TextInput
            className="border border-gray-300 mx-4 rounded-xl text-center"
            value={settings.time}
            editable={false}
          />
        </TouchableOpacity>
        {editSendingTime ? (
          <DateTimePicker
            value={new Date(settings.time)}
            mode="time"
            onChange={(value) => {
              if (value.type === "dismissed") setEditSendingTime(false);
              else if (value.type === "set") {
                setEditSendingTime(false);
                // TODO: Change time settings
                setSettings({
                  ...settings,
                  time: new Date(
                    value.nativeEvent.timestamp || ""
                  ).toTimeString(),
                });
              }
            }}
          />
        ) : (
          <></>
        )}
      </CardContainer>

      <CardContainer>
        <Text>{i18n.t("sms_model")}</Text>
        <TextInput
          value={settings.smsModel}
          placeholder={settings.smsModel}
          onChangeText={(value) => {
            setSettings({ ...settings, smsModel: value });
          }}
          multiline
          numberOfLines={4}
          className={`h-100 ${
            i18n.locale === "ar" ? "text-right" : "text-left"
          }`}
        />
        <TouchableOpacity
          onPress={() => {
            setSettings({ ...settings, smsModel: defaultSettings.smsModel });
          }}
          className="flex-row justify-center items-center mt-3"
        >
          <Text className="mr-1">{i18n.t("reset")}</Text>
          <ResetIcon color={customTheme.colors.headerBackground} />
        </TouchableOpacity>
        <View className="mt-4">
          <Text>{i18n.t("periods")}</Text>
          <SelectBox
            label=""
            options={[1, 2, 3, 4, 5, 6, 7].map((item) => {
              return { id: item.toString(), item: item.toString() };
            })}
            selectedValues={settings.smsPeriods}
            onMultiSelect={(value: SelectboxListItem) => {
              if (settings.smsPeriods.find((item) => item.id === value.id)) {
                setSettings({
                  ...settings,
                  smsPeriods: settings.smsPeriods.filter(
                    (item) => item.id !== value.id
                  ),
                });
              } else {
                setSettings({
                  ...settings,
                  smsPeriods: [...settings.smsPeriods, value],
                });
              }
            }}
            onTapClose={(value: SelectboxListItem) => {
              setSettings({
                ...settings,
                smsPeriods: settings.smsPeriods.filter(
                  (item) => item.id !== value.id
                ),
              });
            }}
            // onChange={onChange()}
            hideInputFilter={false}
            isMulti
            listOptionProps={{ nestedScrollEnabled: true }}
            multiOptionContainerStyle={{
              backgroundColor: customTheme.colors.headerBackground,
            }}
            multiOptionsLabelStyle={{
              backgroundColor: customTheme.colors.headerBackground,
            }}
            arrowIconColor={customTheme.colors.headerBackground}
            toggleIconColor={customTheme.colors.headerBackground}
            inputFilterContainerStyle={{ display: "none" }}
          />
        </View>
      </CardContainer>
      <CardContainer>
        <Text>{i18n.t("remain_sms_model")}</Text>
        <TextInput
          value={settings.remainSmsModel}
          placeholder={settings.remainSmsModel}
          onChangeText={(value) => {
            setSettings({ ...settings, remainSmsModel: value });
          }}
          multiline
          numberOfLines={4}
          className={`h-100 ${
            i18n.locale === "ar" ? "text-right" : "text-left"
          }`}
        />
      </CardContainer>

      <Text className="font-bold text-3xl text-center mt-3">
        {i18n.t("backup")}
      </Text>
      <CardContainer>
        <View
          className={`flex-1 flex-row justify-between ${
            i18n.locale == "ar" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Text>{i18n.t("enable")}</Text>
          <View className={`${i18n.locale === "ar" ? "rotate-180" : null}`}>
            <Switch
              trackColor={{
                false: customTheme.colors.disable,
                true: customTheme.colors.headerBackground,
              }}
              thumbColor={
                settings.enabledBackup
                  ? customTheme.colors.headerBackground
                  : customTheme.colors.disable
              }
              value={settings.enabledBackup}
              onValueChange={(value) =>
                setSettings({ ...settings, enabledBackup: value })
              }
              style={{
                height: 20,
              }}
            />
          </View>
        </View>
        {settings.enabledBackup ? (
          <View className="mt-3">
            <Text>{i18n.t("backup_periods")}</Text>
            <SelectBox
              label=""
              options={[1, 2, 3, 4, 5, 6, 7].map((item) => {
                return { id: item.toString(), item: item.toString() };
              })}
              selectedValues={settings.backupPeriods}
              onMultiSelect={(value: SelectboxListItem) => {
                if (settings.backupPeriods.find((item) => item.id === value.id))
                  setSettings({
                    ...settings,
                    backupPeriods: settings.backupPeriods.filter(
                      (item) => item.id !== value.id
                    ),
                  });
                else
                  setSettings({
                    ...settings,
                    backupPeriods: [...settings.backupPeriods, value],
                  });
              }}
              onTapClose={(value: SelectboxListItem) => {
                setSettings({
                  ...settings,
                  backupPeriods: settings.backupPeriods.filter(
                    (item) => item.id !== value.id
                  ),
                });
              }}
              // onChange={onChange()}
              hideInputFilter={false}
              isMulti
              listOptionProps={{ nestedScrollEnabled: true }}
              multiOptionContainerStyle={{
                backgroundColor: customTheme.colors.headerBackground,
              }}
              multiOptionsLabelStyle={{
                backgroundColor: customTheme.colors.headerBackground,
              }}
              arrowIconColor={customTheme.colors.headerBackground}
              toggleIconColor={customTheme.colors.headerBackground}
              inputFilterContainerStyle={{ display: "none" }}
            />
            <Button
              title={i18n.t("downloadbackup_btn")}
              color={customTheme.colors.headerBackground}
            />
          </View>
        ) : (
          <></>
        )}
      </CardContainer>
    </ScrollView>
  );
};

export default SettingsScreen;
