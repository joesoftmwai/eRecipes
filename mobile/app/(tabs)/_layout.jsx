import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const TabsLayout = () => {
    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        return <Redirect href={'/(auth)/sign-in'} />
    }

  return <Stack /> 
}

export default TabsLayout