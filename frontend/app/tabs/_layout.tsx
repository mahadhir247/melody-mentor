import React from 'react';
import { Stack } from "expo-router";

export default function Root() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
