import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
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
              source={require('../../assets/images/i1.png')}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Welcome Back</Text>

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
              onPress={onSignInPress}
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Signing In ..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-up")}
              style={authStyles.linkContainer}
            >
              <Text style={authStyles.linkText}>
                Don&apos;t have an account? &nbsp;
                <Text style={authStyles.link}>Sign up</Text>
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}