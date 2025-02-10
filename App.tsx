import React from 'react';
import {View, StyleSheet} from 'react-native';
import LeftMenuCard from './android/app/src/components/sidebar';
import LoginScreen from './android/app/src/screens/auth/login';
import Header from './android/app/src/components/header';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <LeftMenuCard />
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.headerContainer}>
          <Header />
        </View>

        <View style={styles.content}>{/* <LoginScreen /> */}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgb(232, 231, 232)',
    padding: 20,
  },
  sidebar: {
    width: 200,
    backgroundColor: '#fff',
    marginRight: 20,
    borderRadius: 20,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(232, 231, 232)',
  },
});
