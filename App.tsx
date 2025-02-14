import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import LeftMenuCard from './android/app/src/components/sidebar';
import LoginScreen from './android/app/src/screens/auth/login';
import Header from './android/app/src/components/header';
import Dashboard from './android/app/src/screens/dashboard';
import CashRegister from './android/app/src/screens/pos/cash-resgister';
import DataTableComponent from './android/app/src/components/data-table';
import CustomDataTable from './android/app/src/components/data-table';
import Listing from './android/app/src/screens/pos/cash-resgister/listing';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.sidebar, collapsed && styles.collapsedSidebar]}>
        <LeftMenuCard collapsed={collapsed} setCollapsed={setCollapsed} />
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.headerContainer}>
          <Header />
        </View>

        <View style={styles.content}>
          {/* <Dashboard /> */}
          <CashRegister
            registerData={[]}
            cashDifference={''}
            cardDifference={''}
            creditDifference={''}
            registerId=""
          />

          {/* <Listing /> */}
        </View>
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
    marginRight: 20,
  },
  collapsedSidebar: {
    width: 60,
    marginRight: 20,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'rgb(232, 231, 232)',
  },
});
