import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const InfoCardDashboard = ({
  mainheading,
  todayLabel,
  todayValue,
  yesterdayLabel,
  yesterdayValue,
  svgIcon,
  arrowSvg,
  svgIconBottom,
}: any) => {
  return (
    <View style={styles.cardContainer}>
      {/* Main Content */}
      <View style={styles.content}>
        {/* Data Section */}
        <View style={styles.dataContainer}>
          {/* Today */}
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>{todayLabel}</Text>
            <Text style={styles.dataValue}>{todayValue}</Text>
          </View>

          {/* Yesterday */}
          <View style={styles.dataItemSecond}>
            <Text style={[styles.dataLabel, {marginTop: 4}]}>
              {yesterdayLabel}
            </Text>
            <Text style={styles.dataValue}>{yesterdayValue}</Text>
          </View>
        </View>

        {/* Icon Section */}
        <View style={styles.iconContainer}>
          {svgIcon && (
            <View
              style={[
                styles.svgIcon,
                {
                  backgroundColor:
                    todayValue > yesterdayValue ? '#00e37d' : '#fe5e5e',
                },
              ]}>
              {svgIcon}
            </View>
          )}
        </View>
      </View>

      {/* Bottom Section with Wave & Arrow */}
      <View style={styles.bottomSection}>
        {svgIconBottom && <View style={styles.svgBottom}>{svgIconBottom}</View>}
        {arrowSvg && (
          <View
            style={[
              styles.arrowContainer,
              {
                transform: [
                  {rotate: todayValue > yesterdayValue ? '3.142rad' : '0rad'},
                ],
              },
            ]}>
            {arrowSvg}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 8,
    height: 140,
    overflow: 'hidden',
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  dataContainer: {
    flex: 1,
  },
  dataItem: {
    marginBottom: 8,
  },

  dataItemSecond: {
    marginTop: -10,
    marginBottom: 25,
  },
  dataLabel: {
    textTransform: 'uppercase',
    fontSize: 10,
    color: '#000',
  },
  dataValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginTop: -64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgIcon: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgb(237, 105, 100)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  bottomSection: {
    marginTop: 46,
    alignItems: 'center',
  },
  svgBottom: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 70,
    right: 16,
  },
});

export default InfoCardDashboard;
