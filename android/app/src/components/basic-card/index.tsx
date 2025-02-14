import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ButtonProps {
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  text?: string;
  textColor?: string;
  textSize?: number;
  onPress?: any;
  style?: any;
  textStyle?: any;
  backgroundColor?: string;
  borderColor?: string;
}

interface BasicCardProps {
  heading?: string;
  children?: React.ReactNode;
  buttons?: ButtonProps[];
  style?: any;
}

const BasicCard: React.FC<BasicCardProps> = ({
  heading,
  children,
  buttons,
  style,
}) => {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.heading}>{heading}</Text>
        <View style={styles.buttonContainer}>
          {buttons?.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                button.style,
                {
                  backgroundColor: button.backgroundColor || 'none',
                  borderColor: button.borderColor || 'transparent',
                  borderWidth: button.borderColor ? 1 : 0,
                },
              ]}
              onPress={button.onPress}>
              {button.icon && (
                <Icon
                  name={button.icon}
                  size={button.iconSize || 16}
                  color={button.iconColor || '#fff'}
                />
              )}
              {button.text && (
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: button.textColor || '#fff',
                      fontSize: button.textSize || 14,
                    },
                    button.textStyle,
                  ]}>
                  {button.text}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View>{children}</View>
    </Card>
  );
};

export default BasicCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    elevation: 0,
    shadowColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgb(103, 223, 135)',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: '400',
  },
});
