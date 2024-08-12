import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../theme/colors'

const CategoriesScreen = () => {
  return (
    <View style={styles.container}>
    <Text style={styles.text}>CategoriesScreen</Text>
  </View>
  )
}

export default CategoriesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  }
})
