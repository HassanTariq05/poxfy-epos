import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import LeftMenuCard from './android/app/src/components/sidebar';
import Header from './android/app/src/components/header';
import Dashboard from './android/app/src/screens/dashboard';
import CashRegister from './android/app/src/screens/pos/cash-resgister';
import Listing from './android/app/src/screens/pos/cash-resgister/listing';
import Customer from './android/app/src/screens/customer/customer';
import Tag from './android/app/src/screens/customer/tag';
import Tier from './android/app/src/screens/customer/tier';
import MyInventory from './android/app/src/screens/inventory/my-inventory';
import OpeningBalance from './android/app/src/screens/inventory/opening-balance';
import Purchase from './android/app/src/screens/inventory/purchase';
import InventoryTransfer from './android/app/src/screens/inventory/inventory-transfer';
import LoginScreen from './android/app/src/screens/auth/login';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Dashboard');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Dashboard':
        return <Dashboard />;
      case 'POS-Cash-Registers':
        return <Listing />;
      case 'Listing':
        return (
          <CashRegister
            registerData={[]}
            cashDifference={''}
            cardDifference={''}
            creditDifference={''}
            registerId=""
          />
        );
      case 'Customer-Customer':
        return <Customer />;
      case 'Customer-Tag':
        return <Tag />;
      case 'Customer-Tier':
        return <Tier />;
      case 'Inventory-My-Inventory':
        return <MyInventory />;
      case 'Inventory-Opening-Balance':
        return <OpeningBalance />;
      case 'Inventory-Purchase':
        return <Purchase />;
      case 'Inventory-Inventory-Transfer':
        return <InventoryTransfer />;
      default:
        // return <Dashboard />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.sidebar, collapsed && styles.collapsedSidebar]}>
        <LeftMenuCard
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setSelectedComponent={setSelectedComponent}
        />
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.headerContainer}>
          <Header />
        </View>


        <View style={styles.content}>{renderComponent()}</View>
        {/* <View style={styles.content}><CashRegister cashDifference={''} registerData={''} cardDifference={''} creditDifference={''} registerId={''}/></View> */}
      </View>
    </View>
    // <View style={styles.container} ><LoginScreen/></View>
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
