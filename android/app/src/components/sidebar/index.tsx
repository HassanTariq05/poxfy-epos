import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const menuItems = [
  {
    name: 'Dashboard',
    icon: 'home-outline',
    color: '#32CD32',
    backgroundTint: 'rgb(245, 255, 250)',
  },
  {
    name: 'Landing Page',
    icon: 'file-download-outline',
    color: '#FFD700',
    backgroundTint: 'rgb(254, 246, 221)',
  },
  {
    name: 'Pages',
    icon: 'file-document-outline',
    color: '#6495ED',
    backgroundTint: 'rgb(224, 229, 253)',
  },
];

const collapsibleItems = [
  {
    name: 'User',
    icon: 'account-outline',
    color: '#00BFFF',
    backgroundTint: 'rgb(227, 247, 254)',
    subItems: [
      {
        name: 'Role Option',
        icon: 'shield-account',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
      },
    ],
  },
  {
    name: 'Subscriptions',
    icon: 'gesture-tap',
    color: '#FF69B4',
    backgroundTint: 'rgb(251, 228, 241)',
  },
  {
    name: 'Reporting',
    icon: 'gesture-tap',
    color: '#FF69B4',
    backgroundTint: 'rgb(251, 228, 241)',
  },
];

export default function LeftMenuCard() {
  // Define the expanded state with proper type
  const [expanded, setExpanded] = useState<{[key: string]: boolean}>({});

  const toggleExpand = (item: string) => {
    setExpanded(prev => ({...prev, [item]: !prev[item]}));
  };

  return (
    <View style={styles.menuCard}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../src/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[
            styles.sidebarToggleButton,
            styles.rotated, // Rotate the button if sidebar is not collapsed
          ]}
          onPress={() => {}}>
          <Image
            source={require('../../../src/assets/images/sidebarToggle.png')}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.menuItemsView}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: item.backgroundTint},
              ]}>
              <Icon name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}

        {collapsibleItems.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => toggleExpand(item.name)}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: item.backgroundTint},
                ]}>
                <Icon name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.name}</Text>
              <Feather
                name={expanded[item.name] ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="black"
                style={{marginLeft: 'auto'}}
              />
            </TouchableOpacity>

            {/* Render subitems under 'User' */}
            {expanded[item.name] &&
              item.subItems &&
              item.subItems.map((subItem, subIndex) => (
                <TouchableOpacity key={subIndex} style={styles.subMenuItem}>
                  <View
                    style={[
                      styles.iconContainer,
                      {backgroundColor: subItem.backgroundTint},
                    ]}>
                    <Icon name={subItem.icon} size={22} color={subItem.color} />
                  </View>
                  <Text style={styles.menuText}>{subItem.name}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 200,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 20, // Indent subitems
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 1,
  },
  sidebarToggleButton: {
    backgroundColor: 'rgb(103, 223, 135)',
    width: 32, // Equivalent to w-8 in Tailwind (8 * 4px = 32px)
    aspectRatio: 1, // Ensures a square shape
    borderRadius: 16, // Half of the width for round shape
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotated: {
    transform: [{rotate: '180deg'}],
  },
  image: {
    width: 16,
    height: 16,
    marginHorizontal: 'auto',
    tintColor: 'brightness(100)',
  },
});
