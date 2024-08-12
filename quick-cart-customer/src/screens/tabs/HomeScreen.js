import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../theme/colors'

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  }
})
