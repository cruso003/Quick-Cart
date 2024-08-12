import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../theme/colors'

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>NotificationsScreen</Text>
    </View>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  }
})
