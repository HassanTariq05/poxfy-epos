import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

export default function Header() {
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.viewStyle}>
        <TouchableOpacity
          style={styles.storeButton}
          onPress={() => setStoreDropdownOpen(!storeDropdownOpen)}>
          <Text style={styles.storeText}>Main Store</Text>
          <Feather name="chevron-down" size={16} color="black" />
        </TouchableOpacity>

        {storeDropdownOpen && (
          <View style={styles.dropdown}>
            <TouchableOpacity style={styles.dropdownItem}>
              <Text>Main Store</Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={[
            styles.searchContainer,
            isSearchFocused && styles.searchTextFocused,
          ]}>
          <MaterialCommunityIcons name="magnify" size={20} color="black" />
          <TextInput
            style={[styles.searchText]}
            value={email}
            placeholder="Search..."
            onChangeText={setEmail}
            keyboardType="email-address"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.adminButton}
        onPress={() => setAdminDropdownOpen(!adminDropdownOpen)}>
        <Text style={styles.adminText}>Admin User</Text>
        <Feather name="chevron-down" size={16} color="black" />
        <MaterialCommunityIcons
          name="account-circle"
          size={24}
          color="gray"
          style={styles.userIcon}
        />
      </TouchableOpacity>

      {adminDropdownOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem}>
            <Text>Admin Option 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem}>
            <Text>Admin Option 2</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingRight: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    width: '100%',
    height: 60,
  },
  viewStyle: {
    flexDirection: 'row',
    gap: 10,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  storeText: {fontSize: 14, marginRight: 5},

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 20,
    width: 220,
  },
  searchText: {fontSize: 14, marginLeft: 5, color: '#000'},
  searchTextFocused: {
    borderWidth: 1,
    borderColor: 'rgb(32, 97, 197)',
    paddingHorizontal: 10,
  },

  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminText: {fontSize: 14, marginRight: 5},
  userIcon: {marginLeft: 6},

  dropdown: {
    position: 'absolute',
    top: 60,
    left: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    width: '90%',
    zIndex: 10,
    elevation: 10,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
