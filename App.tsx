import React from 'react';
import {SafeAreaView, StatusBar, Image} from 'react-native';
import LoginScreen from './android/app/src/screens/auth/login';
import 'nativewind';
import './global.css';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <LoginScreen />
    </SafeAreaView>
  );
}

export default App;
