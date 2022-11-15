import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import { COLORS, SIZES } from "../constants/Theme";
import * as Progress from "react-native-progress";

import { LineChart } from "react-native-chart-kit";
import { DomainName } from "../constants/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TSataticPoint, TUser } from "../types";

// The price of one point
const onePointPrice = 1000;

function mapPriceToPoints(price: number) {
  /**
   * @description: This function computes the number of point correspond to a price
   * @param: price
   * @returns: number of points
   *
   */
  return Math.floor(price / onePointPrice);
}

const Statistics = () => {
  const [userInfo, setUserInfo] = useState<TUser>();
  const [numbers, setNumbers] = useState(new Array(12).fill(0));
  const [thisYearTotal, setThisYearTotal] = useState(0);
  const [thisYearPoints, setThisYearPoints] = useState(0);
  const [this6MonthPoints, setThis6MonthPoints] = useState(0);
  const [thisMonthPoints, setThisMonthPoints] = useState(0);
  const [points, setPoints] = useState<TSataticPoint[]>([
    {
      title: "شهر",
      point: thisMonthPoints,
      progress: thisMonthPoints / 100,
      style: "bg-mBox shadow-lg shadow-mBox mx-2",
    },
    {
      title: "ستة أشهر",
      point: this6MonthPoints,
      progress: this6MonthPoints / 600,
      style: "bg-m6Box shadow-lg shadow-m6Box mx-2",
    },
    {
      title: "سنة",
      point: thisYearPoints,
      progress: thisYearPoints / 1200,
      style: "bg-yBox shadow-lg shadow-yBox mx-2",
    },
  ]);

  useEffect(() => {
    let tmpPoints = Object.assign([], points);
    (tmpPoints[0] as TSataticPoint) = {
      ...(tmpPoints[0] as TSataticPoint),
      point: thisMonthPoints,
      progress: thisMonthPoints / 100,
    };
    setPoints(tmpPoints);
  }, [thisMonthPoints]);

  useEffect(() => {
    let tmpPoints = Object.assign([], points);
    (tmpPoints[1] as TSataticPoint) = {
      ...(tmpPoints[1] as TSataticPoint),
      point: this6MonthPoints,
      progress: this6MonthPoints / 600,
    };
    setPoints(tmpPoints);
  }, [this6MonthPoints]);

  useEffect(() => {
    let tmpPoints = Object.assign([], points);
    (tmpPoints[2] as TSataticPoint) = {
      ...(tmpPoints[2] as TSataticPoint),
      point: thisYearPoints,
      progress: thisYearPoints / 1200,
    };
    setPoints(tmpPoints);
  }, [thisYearPoints]);

  useEffect(() => {
    AsyncStorage.getItem("token", (e, r) => {
      if (r && r.length > 0) {
        fetch(DomainName + "/api/history/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "jwt " + r,
          },
        })
          .then((res) => res.json())
          .then((result) => {
            const today = new Date();
            const thisYear = today.getFullYear();
            const thisMonth = today.getMonth();
            let t_thisMonthTotal = 0;
            let t_this6MonthTotal = 0;
            // Set numbers
            const tmpNumbers = new Array(12).fill(0);
            let tmp_total = 0;
            for (const res of result) {
              const date = res.date.split("-");
              if (date[0] === thisYear.toString()) {
                tmpNumbers[Number(date[1]) - 1] += res.purchase_price;

                // Compute this year total
                tmp_total += res.purchase_price;

                // Compute this 6 month total
                if (thisMonth <= 6 && Number(date[1]) <= 6) {
                  t_this6MonthTotal += res.purchase_price;
                } else if (thisMonth > 6 && Number(date[1]) > 6) {
                  t_this6MonthTotal += res.purchase_price;
                }

                // compute this month total
                if (thisMonth + 1 === Number(date[1])) {
                  t_thisMonthTotal += res.purchase_price;
                }
              }
            }
            setNumbers(tmpNumbers);
            // Set total
            setThisYearTotal(tmp_total);
            // set points
            setThisYearPoints(mapPriceToPoints(tmp_total));
            setThis6MonthPoints(mapPriceToPoints(t_this6MonthTotal));
            setThisMonthPoints(mapPriceToPoints(t_thisMonthTotal));
          });
      }
    });
  }, []);

  const data = {
    labels: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ],
    datasets: [
      {
        data: numbers,
      },
    ],
  };
  const chartConfig = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: COLORS.white,
    backgroundGradientToOpacity: 1,
    color: () => COLORS.primary,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    barRaduis: SIZES.radius,
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1, bg-white"
    >
      <View className="flex-1 justify-center items-center">
        <View className="w-full justify-center items-center">
          <Text className="text-4xl font-bold p-3 pb-0 text-center justify-center items-center">
            مرحبا, {userInfo?.name}
          </Text>
        </View>

        <View className="w-full justify-center items-center">
          <Text className="text-3xl m-2 px-2 w-full text-gray-500">النقط</Text>
          <View className="flex-row">
            {points.map((item, index) => {
              return (
                <View
                  key={index}
                  className={`
                    flex-1
                    justify-center
                    items-center
                    p-2
                    mb-2
                    rounded-lg
                    ${item.style}
                  `}
                >
                  <Text className="text-white text-lg font-bold p-2">
                    {item.title}
                  </Text>
                  <Progress.Circle
                    animated={true}
                    progress={item.progress}
                    color={COLORS.white}
                    showsText={true}
                    formatText={() => (item.progress * 100).toFixed(2) + "%"}
                    size={SIZES.width / 3 - SIZES.padding * 3}
                  />
                  <Text className="text-gray-200 p-2 w-full">
                    عدد النقط: {item.point}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="p-2 bg-gray-200 rounded-t-3xl mt-2 mx-2 w-full justify-center items-center">
          <View className="w-full justify-center items-center">
            <Text className="text-3xl m-2 px-3 w-full text-gray-500">
              رقم المعاملات(شهريا)
            </Text>
            <LineChart
              style={{
                flex: 1,
              }}
              data={data}
              width={SIZES.width - SIZES.padding * 4}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              horizontalLabelRotation={-30}
              withInnerLines={false}
              bezier
              fromZero
            />
          </View>

          <View className="w-full justify-center items-center">
            <Text className="text-3xl m-2 px-3 w-full text-gray-500">
              رقم المعاملات السنوي
            </Text>
            <View
              className={`
                flex-1
                justify-center
                items-center
                p-2
                mb-2
                rounded-lg
                bg-white
                w-full
                mx-2
              `}
            >
              <Text className="text-primary text-3xl font-bold p-2">
                {thisYearTotal.toFixed(2)} د.م
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Statistics;
