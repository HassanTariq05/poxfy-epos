import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
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
import {Switch} from 'react-native';
import SplashScreen from './android/app/src/screens/splash';
import useAuthStore from './android/app/src/redux/feature/store';
import {
  Api,
  updateBaseUrl,
  updateSocketUrl,
} from './android/app/src/network/client';
import SalesHistory from './android/app/src/screens/pos/sales-history';
import ProcessSales from './android/app/src/screens/pos/process-sales';
import Loyalty from './android/app/src/screens/customer/loyalty';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_QUEUE_KEY = 'offline_sales_queue';

var processedQueue = Array<string>();

const processOfflineQueue = async () => {
  console.log('processOfflineQueue');
  const queueStr = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  if (!queueStr) return;

  const queue = JSON.parse(queueStr);
  const token = await AsyncStorage.getItem('userToken');

  for (const {payload, headerUrl} of queue) {
    try {
      if (!processedQueue.includes(payload.offlineUUID)) {
        processedQueue.push(payload.offlineUUID);
        console.log('Syncing', payload.offlineUUID);
        await Api.post(`sales`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            origin: headerUrl,
            referer: headerUrl,
            'access-key': 'q2DU1I89vQgw',
          },
        });
      }
    } catch (err) {
      console.log('Retry failed', err);
    }
  }

  await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
};

export const startNetworkListener = () => {
  console.log('startNetworkListener');
  NetInfo.addEventListener(async state => {
    console.log('NetworkState', state);
    if (state.isConnected && state.isInternetReachable) {
      await processOfflineQueue();
    }
  });
};

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
  const Drawer = createDrawerNavigator();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'permanent',
        drawerStyle: {
          width: collapsed ? 60 : 208,
          borderTopWidth: 8,
          borderBottomWidth: 8,
          borderLeftWidth: 8,
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
      <Drawer.Screen name="POS-Sales-History">
        {() => (
          <ScreenWrapper>
            <SalesHistory />
          </ScreenWrapper>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="POS-Process-Sales">
        {() => (
          <ScreenWrapper>
            <ProcessSales />
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
      {/* <Drawer.Screen name="Customer-Loyalty">
        {() => (
          <ScreenWrapper>
            <Loyalty />
          </ScreenWrapper>
        )}
      </Drawer.Screen> */}
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
  const Stack = createStackNavigator();

  const [showSplash, setShowSplash] = useState(true);

  const {
    isAuthenticated,
    login,
    isLoading,
    setIsLoadingTrue,
    setIsLoadingFalse,
    setHeaderUrl,
  } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      updateBaseUrl();
      const socketUrl = await updateSocketUrl();
      if (socketUrl) {
        setHeaderUrl(socketUrl);
      }
      setIsLoadingTrue();
      const token = await getUserToken();
      if (token) {
        console.log('Token:', token);
        login();
        setIsLoadingFalse();
      }
      setIsLoadingFalse();
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    };
    checkAuth();
    startNetworkListener();
  }, []);

  return (
    <View style={styles.navContainer}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true} size="large" color="#00ff00" />
        </View>
      )}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {showSplash ? (
            <Stack.Screen name="Splash">
              {props => <SplashScreen />}
            </Stack.Screen>
          ) : !isAuthenticated ? (
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} onLogin={login} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Dashboard" component={DrawerNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(232, 231, 232)',
  },
  navContainer: {flex: 1, backgroundColor: 'rgb(232, 231, 232)'},
  headerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 8,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgb(232, 231, 232)',
    overflow: 'visible',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
  },
});
