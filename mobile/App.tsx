import { useFonts, Karla_400Regular, Karla_700Bold } from '@expo-google-fonts/karla';
import { NativeBaseProvider } from 'native-base';
import { Loading } from './src/components/Loading';
import { theme } from './src/theme/default';
import { Routes } from './src/routes';
import { StatusBar } from 'react-native';
import { AuthContextProvider } from './src/context/AuthContext';
import { AnnouncedContextProvider } from './src/context/AnnouncedContext';
import React from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {

  const [isFontsIsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold })
 
  return (
    <NativeBaseProvider theme={theme}>
      <AnnouncedContextProvider>
        <AuthContextProvider>
          <StatusBar
            barStyle="dark-content"
            translucent
            backgroundColor="transparent"
          />
          <GestureHandlerRootView style={{ flex : 1}}>
            <BottomSheetModalProvider>
              {isFontsIsLoaded ? <Routes /> : <Loading />}
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </AuthContextProvider>
      </AnnouncedContextProvider>
    </NativeBaseProvider>
  );
}