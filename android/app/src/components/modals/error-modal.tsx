import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ErrorModalProps {
  error: string;
  errorModalVisible: any;
  setErrorModalVisible: any;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  error,
  errorModalVisible,
  setErrorModalVisible,
}) => {
  return (
    <Modal
      visible={errorModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setErrorModalVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Image
            width={10}
            height={10}
            source={require('../../../src/assets/images/error.png')}
          />
          <Text style={styles.text}>{error}</Text>
          <View style={styles.closeButtonView}>
            <TouchableOpacity
              onPress={() => setErrorModalVisible(false)}
              style={styles.closeButton2}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    color: 'black',
    margin: 10,
  },
  closeButtonView: {
    backgroundColor: 'none',
    width: 180,
  },
  closeButton2: {
    backgroundColor: 'rgb(218, 218, 218)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  closeText: {
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
});

export default ErrorModal;
