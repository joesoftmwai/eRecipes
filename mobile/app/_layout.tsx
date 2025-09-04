import { Slot } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { SafeAreaView } from "react-native-safe-area-context";
// import { SafeAreaView } from "react-native";

export default function RootLayout() {
  return (
     <ClerkProvider tokenCache={tokenCache}>
        <SafeAreaView style={{ flex: 1 }}>
          <Slot/>
        </SafeAreaView>
     </ClerkProvider>
    );
}
