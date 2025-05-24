import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface WelcomeBannerProps {
  onRefresh?: any;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({onRefresh}) => {
  const [user, setUser] = useState<string | null>();
  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(user => setUser(user))
      .catch(error => console.error('Failed to load user:', error));
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/black-banner.png')}
        style={styles.bannerImage}
      />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome, <Text style={styles.userName}>{user}</Text>
          <View style={styles.emojiView}>
            <Image
              source={require('../../assets/images/happy-emoji.png')}
              style={styles.emoji}
            />
          </View>
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{new Date().toDateString()}</Text>
          </View>
          <View style={[styles.dateContainer, {marginLeft: 8}]}>
            <TouchableOpacity
              onPress={() => {
                onRefresh();
              }}>
              <Feather name="refresh-cw" size={17} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
    height: 60,
    position: 'relative',
    marginHorizontal: 8,
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{translateY: -25}],
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '100',
    color: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '400',
  },
  emojiView: {
    marginLeft: 8,
  },
  emoji: {
    marginLeft: 8,
    marginTop: 4,
    width: 30,
    height: 28,
  },
  dateContainer: {
    backgroundColor: 'rgb(237, 105, 100)',
    borderRadius: 16,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  dateText: {
    color: 'white',
    fontSize: 14,
  },
});

export default WelcomeBanner;
