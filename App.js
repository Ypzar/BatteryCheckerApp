import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import * as Battery from "expo-battery";
// import RNFullBatteryStatus from "react-native-full-battery-status";

import DeviceInfo from "react-native-device-info";

export default function BatteryStatus() {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [batteryCharging, setBatteryCharging] = useState(false);
  const [batteryStrokes, setBatteryStrokes] = useState(Array(5).fill(false));
  const [currentStroke, setCurrentStroke] = useState(0);
  // const [batteryHealth, setBatteryHealth] = useState("");
  // const [batteryTemperature, setBatteryTemperature] = useState("");
  // const [batteryVoltage, setBatteryVoltage] = useState("");
  // const [batteryTechnology, setBatteryTechnology] = useState("");

  // const [deviceModel, setDeviceModel] = useState(null);
  // const [deviceManufacturer, setDeviceManufacturer] = useState(null);
  // const [isEmulator, setIsEmulator] = useState(false);

  useEffect(() => {
    const getBatteryInfo = async () => {
      const batteryStatus = await Battery.getBatteryStateAsync();
      const batteryLevel = await Battery.getBatteryLevelAsync();
      // const healthStatus = await RNFullBatteryStatus.getHealthStatus();
      // const temperature = await RNFullBatteryStatus.getTemperature();
      // const voltage = await RNFullBatteryStatus.getVoltage();
      // const technology = await RNFullBatteryStatus.getTechnology();

      setBatteryLevel(batteryLevel);
      setBatteryCharging(batteryStatus.charging);
      // setBatteryHealth(healthStatus);
      // setBatteryTechnology(technology);
      // setBatteryTemperature(temperature);
      // setBatteryVoltage(voltage);
    };

    // Fetch device information
    // const getDeviceInfo = () => {
    //   const model = DeviceInfo.getModel();
    //   const manufacturer = DeviceInfo.getManufacturer();
    //   setDeviceModel(model);
    //   setDeviceManufacturer(manufacturer);
    // };

    // const checkEmulator = async () => {
    //   const isEmulator = await DeviceInfo.isEmulator();
    //   setIsEmulator(isEmulator);
    // };

    getBatteryInfo();
    // getDeviceInfo();
    // checkEmulator();

    const batteryListener = Battery.addBatteryLevelListener(
      ({ batteryLevel }) => {
        setBatteryLevel(batteryLevel);
      }
    );

    const chargingListener = Battery.addBatteryStateListener(
      ({ batteryState }) => {
        setBatteryCharging(batteryState === Battery.BatteryState.CHARGING);
      }
    );

    return () => {
      batteryListener.remove();
      chargingListener.remove();
    };
  }, []);

  useEffect(() => {
    if (batteryCharging) {
      setBatteryStrokes(Array(5).fill(false));
      const timer = initChargingSequence();
      return () => clearInterval(timer);
    } else {
      calculateBatteryStrokes(batteryLevel);
    }
  }, [batteryCharging, batteryLevel]);

  const initChargingSequence = () =>
    setInterval(() => {
      if (currentStroke >= 5) {
        setCurrentStroke(0);
        setBatteryStrokes(Array(5).fill(false));
        return;
      }

      setBatteryStrokes((strokes) =>
        strokes.map((stroke, idx) => (idx === currentStroke ? true : stroke))
      );
      setCurrentStroke(currentStroke + 1);
    }, 1000);

  const calculateBatteryStrokes = (level) => {
    const batteryPercent = level * 100;
    const totalStrokesCount = Math.ceil((batteryPercent * 5) / 100);

    setBatteryStrokes(
      Array(5)
        .fill(true)
        .map((d, i) => i < totalStrokesCount)
    );
  };

  let batteryStatusClass =
    batteryCharging || batteryLevel > 0.2 ? "battery-full" : "battery-empty";

  return (
    <SafeAreaView className="flex-1 justify-center items-center my-5 p-5">
      <View className="flex-1">
        <Text className="text-lg font-bold mt-5">BATTERY CHECKER APP</Text>
      </View>

      {/* {isEmulator ? (
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold">This is an emulator.</Text>
        </View>
      ) : ( */}
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold">
            Battery Level: {Math.round(batteryLevel * 100)}%
          </Text>
          <View style={{ flexDirection: "row" }}>
            {batteryStrokes.map((stroke, index) => (
              <View
                key={index}
                style={{
                  width: 10,
                  height: 20,
                  backgroundColor: stroke ? "green" : "gray",
                  margin: 2,
                }}
              />
            ))}
          </View>
          <Text className="text-lg font-bold">
            Battery Status: {batteryCharging ? "Charging" : "Not Charging"}
          </Text>
          <View
            style={{
              width: 50,
              height: 20,
              backgroundColor:
                batteryStatusClass === "battery-full" ? "green" : "red",
              marginTop: 10,
            }}
          />
          {/* <Text className="text-lg font-bold">
            Battery Health: {batteryHealth}
          </Text>
          <Text className="text-lg font-bold">
            Battery Temperature: {batteryTemperature}°C
          </Text>
          <Text className="text-lg font-bold">
            Battery Voltage: {batteryVoltage} mV
          </Text>
          <Text className="text-lg font-bold">
            Battery Technology: {batteryTechnology}
          </Text>
          <Text className="text-lg font-bold">
            Device Model: {deviceModel || "Loading..."}
          </Text>
          <Text className="text-lg font-bold">
            Device Manufacturer: {deviceManufacturer || "Loading..."}
          </Text> */}
        </View>
      {/* )} */}
    </SafeAreaView>
  );
}
