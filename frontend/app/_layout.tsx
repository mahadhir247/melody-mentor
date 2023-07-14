import { Stack } from "expo-router";
import { Provider } from "./search/filterContext";

export default function Root() {
  return (
    <Provider>
      <Stack screenOptions={{ headerShown: true }} />
    </Provider>
  );
}
