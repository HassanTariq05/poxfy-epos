import React from 'react';
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
import {menuItems, collapsibleItems} from './menu-items';

interface LeftMenuCardProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftMenuCard({
  collapsed,
  setCollapsed,
}: LeftMenuCardProps) {
  const [expanded, setExpanded] = React.useState<{[key: string]: boolean}>({});

  const toggleExpand = (item: string) => {
    setExpanded(prev => ({...prev, [item]: !prev[item]}));
  };

  return (
    <View style={[styles.menuCard, collapsed && styles.collapsedMenuCard]}>
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
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: item.backgroundTint},
              ]}>
              <Icon name={item.icon} size={22} color={item.color} />
            </View>
            {!collapsed && <Text style={styles.menuText}>{item.name}</Text>}
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
              {!collapsed && <Text style={styles.menuText}>{item.name}</Text>}
              {!collapsed && (
                <Feather
                  name={expanded[item.name] ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="black"
                  style={{marginLeft: 'auto'}}
                />
              )}
            </TouchableOpacity>

            {expanded[item.name] &&
              !collapsed &&
              item.subItems &&
              item.subItems.map((subItem, subIndex) => (
                <TouchableOpacity key={subIndex} style={styles.subMenuItem}>
                  <View style={[styles.iconContainer]}></View>
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
    minWidth: 60,
    maxWidth: 200,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexShrink: 1,
  },
  collapsedMenuCard: {
    minWidth: 60,
    paddingHorizontal: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    flexWrap: 'nowrap',
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgb(244, 244, 244)',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flexShrink: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 1,
  },
  iconContainerCollapsed: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
});
