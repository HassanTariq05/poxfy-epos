import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="relative flex items-center justify-center h-full py-10">
      <View className="flex-1 flex items-center h-full border-r-2 border-lightGrey">
        {/* Left Side - Image */}
        <Image
          source={require('../../../assets/images/login.png')}
          className="block mx-auto w-[32rem]"
        />

        {/* Vertical Separator */}
        <View className="w-[2px] bg-gray-300 h-full mx-4" />

        {/* Right Side - Login Form */}
        <View className="flex-1 justify-center items-center self-center px-5">
          <Text className="text-2xl font-medium mb-2">Sign In</Text>
          <Text className="text-lightGrey text-md mb-4">
            Enter your credentials to access your account.
          </Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="w-full p-2 border border-gray-300 rounded-2xl mb-2"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            className="w-full p-2 border border-gray-300 rounded-2xl mb-2"
            secureTextEntry
          />

          <TouchableOpacity className="bg-orange-500 p-2 rounded-2xl w-full items-center mt-2">
            <Text className="text-white text-base font-bold">Login</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text className="text-orange-500 mt-2">Forget your password?</Text>
          </TouchableOpacity>

          <View className="flex-row mt-5">
            <Text>Terms of Use</Text>
            <Text className="mx-1">•</Text>
            <Text>Privacy Policy</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
