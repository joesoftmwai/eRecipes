import * as React from 'react'
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { authStyles } from '../../assets/styles/auth.styles'
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'

export default function VerifyEmail({email, onBack}) {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [code, setCode] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        setLoading(true)
    
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
        } finally {
            setLoading(false)
        }
    }
      
    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView 
                style={authStyles.keyboardView} 
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS == "ios" ?  64 : 0}
            >
            <ScrollView 
                contentContainerStyle={authStyles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <View style={authStyles.imageContainer}>
                <Image 
                    source={require('../../assets/images/i3.png')}
                    style={authStyles.image}
                    contentFit="contain"
                />
                </View>
    
                <Text style={authStyles.title}>Verify Account</Text>
                <Text style={authStyles.subtitle}>We&apos;ve sent an OTP to {email}</Text>

                <View style={authStyles.formContainer}>
                    <View style={authStyles.inputContainer}>
                        <TextInput
                        style={authStyles.textInput}
                        placeholder='Enter Email'
                        placeholderTextColor={COLORS.textLight}
                        value={code}
                        onChangeText={setCode}
                        keyboardType='number-pad'
                        autoCapitalize='none'
                        />
                    </View>
        
        
                    <TouchableOpacity 
                        onPress={onVerifyPress}
                        style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text style={authStyles.buttonText}>
                        {loading ? "Verifying..." : "Verify Email"}
                        </Text>
                    </TouchableOpacity>
        
                    <TouchableOpacity
                        onPress={onBack}
                        style={authStyles.linkContainer}
                    >
                        <Text style={authStyles.linkText}>
                        <Text style={authStyles.link}>Back to Sign up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
  
}
