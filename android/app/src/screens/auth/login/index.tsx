import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import {useForm, Controller} from 'react-hook-form';
import {submitLogin} from './service';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../../../redux/feature/store';

const LoginScreen = ({onLogin}: any) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {setIsLoadingTrue, setIsLoadingFalse} = useAuthStore();

  const onSubmit = async (data: any) => {
    try {
      setIsLoadingTrue()
      const response = await submitLogin(data);
      if (response?.status == 201 || response?.status == 200) {
        saveToken(response.data.data.accessToken);
        setIsLoadingFalse()
        handleLogin();
      }
    } catch (err) {
      console.log(err);
      setIsLoadingFalse()
      ToastAndroid.showWithGravityAndOffset(
        'Invalid email or password',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  };

  const saveToken = async (token: string) => {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const handleLogin = () => {
    onLogin();
  };

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

      <View style={styles.separator} />

      <View style={styles.rightSide}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to access your account.
          </Text>

          <Controller
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                placeholder="dummy@admin.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.input, errors.email ? styles.inputError : null]}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                placeholder="**********"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.input]}
                keyboardType="default"
                autoCapitalize="none"
                secureTextEntry={true}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={styles.errorText}>This is required.</Text>
          )}

          {/* <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forget your password?</Text>
          </TouchableOpacity> */}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.loginButton}>
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
    flex: 1.2,
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
    paddingHorizontal: 40,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    width: '90%',
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
  inputError: {
    borderColor: '#ff6b6b',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
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
