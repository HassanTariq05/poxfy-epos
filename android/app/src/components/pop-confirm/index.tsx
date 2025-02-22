import React, {ReactNode, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface CustomPopConfirmProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  children?: any;
  disabled?: boolean;
  visible: any;
  setVisible: any;
}

const CustomPopConfirm: React.FC<CustomPopConfirmProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  children,
  disabled = false,
  visible,
  setVisible,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    setVisible(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => !disabled && setVisible(true)}>
        {children}
      </TouchableOpacity>

      {visible && (
        <Modal
          transparent
          animationType="fade"
          visible={visible}
          onRequestClose={handleCancel}>
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}>
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirm}>
                  <Text style={styles.confirmText}>{okText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    position: 'absolute',
    top: '40%',
    right: 0,
    width: '30%',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 2},
    shadowRadius: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    alignSelf: 'stretch', // Ensure it stretches to fit content
    flexShrink: 1, // Prevents extra space from pushing content
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: 'rgb(237, 106, 101)',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomPopConfirm;
