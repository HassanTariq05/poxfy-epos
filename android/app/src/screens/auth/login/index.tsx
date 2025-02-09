import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#A8E6A3', '#B9F2B4']}
        style={styles.gradientBackground}>
        <BlurView
          style={styles.blurBackground}
          blurType="xlight"
          blurAmount={10}
        />
      </LinearGradient>

      <LinearGradient
        colors={['#FFDADA', '#FFF0F0']}
        style={styles.gradientBackgroundRed}>
        <BlurView
          style={styles.blurBackground}
          blurType="xlight"
          blurAmount={10}
        />
      </LinearGradient>

      <View style={styles.leftSide}>
        <Image
          source={require('../../../assets/images/login.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Vertical Separator */}
      <View style={styles.separator} />

      {/* Right Side - Login Form */}
      <View style={styles.rightSide}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to access your account.
          </Text>

          <TextInput
            placeholder="dummy@admin.com"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forget your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.footer}>
          <Text style={styles.separatorText}>Terms of Use</Text>
          <Text style={styles.separatorText}>•</Text>
          <Text style={styles.separatorText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgb(232, 231, 233)',
  },
  gradientBackground: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },

  gradientBackgroundRed: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },

  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
  },

  leftSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  separator: {
    width: 2,
    backgroundColor: 'rgb(191,191,191)',
    height: '95%',
  },
  rightSide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 8,
    alignSelf: 'center',
  },
  subtitle: {
    color: 'rgb(191,191,191)',
    fontSize: 16,
    marginBottom: 16,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: '#fe5e5e',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: 'rgb(191,191,191)',
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingBottom: 20,
  },
  separatorText: {
    marginHorizontal: 4,
    color: 'rgb(191,191,191)',
  },
});

export default LoginScreen;
