import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {menuItems, collapsibleItems} from './menu-items';
import useAuthStore from '../../redux/feature/store';

interface LeftMenuCardProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedComponent: any;
  navigation: any;
}

export default function LeftMenuCard({
  collapsed,
  setCollapsed,
  setSelectedComponent,
  navigation,
}: LeftMenuCardProps) {
  const [expanded, setExpanded] = React.useState<{[key: string]: boolean}>({});
  const [selectedItem, setSelectedItem] = React.useState<string | null>(
    'Dashboard',
  );

  // Animated value for smooth transitions
  const widthAnim = useRef(new Animated.Value(collapsed ? 60 : 200)).current;
  const opacityAnim = useRef(new Animated.Value(collapsed ? 0 : 1)).current;

  const [submenuModalVisible, setSubmenuModalVisible] = useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState<any>([]);
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: collapsed ? 60 : 200,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(opacityAnim, {
      toValue: collapsed ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [collapsed]);

  const toggleExpand = (item: string | undefined) => {
    if (item) {
      if (collapsed) {
        setSubmenuModalVisible(true);
      }
      setExpanded(prev => ({...prev, [item]: !prev[item]}));
    }
  };

  const {setSalesFlag, setSalesId} = useAuthStore();

  const handleSelectComponent = (routeName: string, itemName: string) => {
    setSalesFlag(false);
    setSalesId('');
    setSelectedComponent(routeName);
    setSelectedItem(itemName);
    navigation.navigate(routeName);
  };

  return (
    <Animated.View style={[styles.menuCard, {width: widthAnim}]}>
      <View
        style={[
          styles.menuCard1,
          collapsed && styles.collapsedMenuCard,
          {width: collapsed ? 60 : 200},
        ]}>
        <View
          style={[
            styles.logoContainer,
            collapsed ? styles.logoContainerCollapsed : styles.logoContainer,
          ]}>
          {!collapsed && (
            <Image
              source={require('../../../src/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            style={[
              styles.sidebarToggleButton,
              collapsed ? styles.notRotated : styles.rotated,
            ]}
            onPress={() => setCollapsed(!collapsed)}>
            <Image
              source={require('../../../src/assets/images/sidebarToggle.png')}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuItemsView}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                selectedItem === item.name ? styles.selectedMenuItem : null,
              ]}
              onPress={() => handleSelectComponent(item.component, item.name)}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: item.backgroundTint},
                ]}>
                <Icon name={item.icon} size={17} color={item.color} />
              </View>
              <Animated.View style={{opacity: opacityAnim}}>
                {!collapsed && (
                  <Text
                    style={[
                      styles.menuText,
                      selectedItem === item.name && styles.selectedMenuText,
                    ]}>
                    {item.name}
                  </Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          ))}

          {collapsibleItems.map((item, index) => {
            const isChildSelected = item?.subItems?.some(
              subItem => subItem.name === selectedItem,
            );

            return (
              <View key={index}>
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    isChildSelected ? styles.selectedMenuItem : null,
                  ]}
                  onPress={() => {
                    toggleExpand(item?.name);
                    setSelectedSubMenu(item?.subItems || []);
                  }}>
                  <View
                    style={[
                      styles.iconContainer,
                      {backgroundColor: item?.backgroundTint},
                    ]}>
                    <Icon
                      name={item?.icon || ''}
                      size={22}
                      color={item?.color || ''}
                    />
                  </View>
                  <Animated.View style={{opacity: opacityAnim}}>
                    {!collapsed && (
                      <Text
                        style={[
                          styles.menuText,
                          isChildSelected && {color: 'white'},
                        ]}>
                        {item?.name || ''}
                      </Text>
                    )}
                  </Animated.View>
                  {!collapsed && (
                    <Feather
                      name={
                        expanded[item?.name || '']
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={18}
                      color="black"
                      style={[
                        {marginLeft: 'auto', marginRight: 16},
                        isChildSelected && {color: 'white'},
                      ]}
                    />
                  )}
                </TouchableOpacity>

                {expanded[item?.name || ''] &&
                  !collapsed &&
                  item?.subItems &&
                  item.subItems.map((subItem, subIndex) => (
                    <TouchableOpacity
                      key={subIndex}
                      style={styles.subMenuItem}
                      onPress={() =>
                        handleSelectComponent(subItem.component, subItem.name)
                      }>
                      <View style={[styles.iconContainer]}></View>
                      <Text style={[styles.menuText]}>{subItem.name}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Modal visible={submenuModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backdrop}
            onPress={() => setSubmenuModalVisible(false)}
          />
          <Animated.View style={[styles.modal]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {selectedSubMenu?.map((subItem: any, subIndex: any) => (
                <TouchableOpacity
                  key={subIndex}
                  style={[
                    styles.subMenuItemCollapsed,
                    subIndex !== selectedSubMenu.length - 1 &&
                      styles.borderBottom,
                  ]}
                  onPress={() => {
                    handleSelectComponent(subItem?.component, subItem?.name);
                    setSubmenuModalVisible(false);
                  }}>
                  <Text style={styles.menuText}>{subItem?.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    minWidth: 60,
    maxWidth: 240,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexShrink: 1,
  },
  menuCard1: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    minWidth: 60,
    maxWidth: 240,
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 30,
    flexShrink: 1,
  },
  collapsedMenuCard: {
    minWidth: 60,
    paddingHorizontal: 6,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  logoContainerCollapsed: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: '50%',
  },
  menuItemsView: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginLeft: 6,
    marginRight: 6,
    backgroundColor: 'rgb(244, 244, 244)',
  },
  subMenuItemCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgb(255, 255, 255)',
    // borderBottomColor: '#ccc',
    // borderBottomWidth: 1,
  },
  borderBottom: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  selectedMenuItem: {
    backgroundColor: 'rgb(237, 111, 106)',
    color: 'white',
  },
  selectedSubMenuItem: {
    backgroundColor: 'rgb(244, 244, 244)',
  },
  selectedMenuText: {
    color: 'white',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flexShrink: 1,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
    marginLeft: 8,
  },
  sidebarToggleButton: {
    backgroundColor: 'rgb(103, 223, 135)',
    width: 32,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotated: {
    transform: [{rotate: '180deg'}],
  },
  notRotated: {
    transform: [{rotate: '0deg'}],
  },
  image: {
    width: 16,
    height: 16,
    marginHorizontal: 'auto',
    tintColor: 'brightness(100)',
  },

  notesText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgb(103, 223, 135)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backdrop: {
    flex: 1,
    width: '100%',
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '7%',
    width: '20%',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 2},
    shadowRadius: 5,
    borderRadius: 16,
    padding: 10,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    paddingBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    color: 'gray',
  },
  required: {
    color: 'red',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  input: {
    height: 45,
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 15,
    borderColor: 'rgb(240,240,240)',
    borderWidth: 1,
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: 'none',
    borderWidth: 1,
    borderColor: 'rgb(240,240,240)',
  },
  button: {
    backgroundColor: '#ED6964',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // iconContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 8,
  // },
});
