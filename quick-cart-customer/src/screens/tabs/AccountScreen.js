import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../theme/colors'

const AccountScreen = () => {
  return (
    <View style={styles.container}>
    <Text style={styles.text}>AccountScreen</Text>
  </View>
  )
}

export default AccountScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  }
})
