import * as React from 'react'
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { authStyles } from '../../assets/styles/auth.styles'
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import VerifyEmail from './verify-email'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill all fields.")
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be atleast 8 Characters.")
      return
    }

    if (!isLoaded) return

    setLoading(true);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      Alert.alert("Error", err?.errors?.[0]?.message || "Sign up failed.")
    } finally {
      setLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        Alert.alert("Error", "Account Verification failed.")
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert("Error", err?.errors?.[0]?.message || "Account Verification failed.")
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <VerifyEmail
        email={emailAddress}
        onBack={() => setPendingVerification(false)}
      />
    )
  }

  return (
     <View style={authStyles.container}>
      <KeyboardAvoidingView 
        style={authStyles.keyboardView} 
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ?  64 : 0}
        >
        <ScrollView contentContainerStyle={authStyles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={authStyles.imageContainer}>
            <Image 
              source={require('../../assets/images/i2.png')}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>

          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder='Enter Email'
                placeholderTextColor={COLORS.textLight}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>

            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder='Enter Password'
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize='none'
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={authStyles.eyeButton}>
                <Ionicons name={showPassword ? 'eye-outline' : "eye-off-outline"} size={20} style={COLORS.textLight} />
              </TouchableOpacity>
             </View>

            <TouchableOpacity 
              onPress={onSignUpPress}
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Signing Up ..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-in")}
              style={authStyles.linkContainer}
            >
              <Text style={authStyles.linkText}>
                Already have an account? &nbsp;
                <Text style={authStyles.link}>Sign in</Text>
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}