import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
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
import {getUserToken} from './android/app/src/user';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function ScreenWrapper({children}: any) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

function DrawerNavigator() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'permanent',
        drawerStyle: {
          width: collapsed ? 60 : 200,
          borderTopWidth: 20,
          borderBottomWidth: 20,
          borderLeftWidth: 20,
          borderRightWidth: collapsed ? 60 : 0,
          borderColor: 'rgb(232, 231, 232)',
          backgroundColor: 'rgb(232, 231, 232)',
        },
      }}
      drawerContent={props => (
        <LeftMenuCard
          {...props}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setSelectedComponent={setSelectedComponent}
        />
      )}>
      <Drawer.Screen name="Dashboard">
        {() => (
          <ScreenWrapper>
            <Dashboard />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="POS-Cash-Registers">
        {() => (
          <ScreenWrapper>
            <Listing />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Listing">
        {() => (
          <ScreenWrapper>
            <CashRegister
              registerData={[]}
              cashDifference=""
              cardDifference=""
              creditDifference=""
              registerId=""
            />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Customer-Customer">
        {() => (
          <ScreenWrapper>
            <Customer />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Customer-Tag">
        {() => (
          <ScreenWrapper>
            <Tag />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Customer-Tier">
        {() => (
          <ScreenWrapper>
            <Tier />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Inventory-My-Inventory">
        {() => (
          <ScreenWrapper>
            <MyInventory />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Inventory-Opening-Balance">
        {() => (
          <ScreenWrapper>
            <OpeningBalance />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Inventory-Purchase">
        {() => (
          <ScreenWrapper>
            <Purchase />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Inventory-Inventory-Transfer">
        {() => (
          <ScreenWrapper>
            <InventoryTransfer />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getUserToken();
      setIsAuthenticated(!!token);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.navContainer}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {!isAuthenticated ? (
            <Stack.Screen name="Login">
              {props => (
                <LoginScreen
                  {...props}
                  onLogin={() => setIsAuthenticated(true)}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Dashboard" component={DrawerNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
    // <View style={styles.container} ><LoginScreen/></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(232, 231, 232)',
    padding: 20,
  },
  navContainer: {flex: 1, backgroundColor: 'rgb(232, 231, 232)'},
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
