import { StyleSheet, Platform, StatusBar } from 'react-native';
import colors from '../../../theme/colors';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.danger,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.white,
    paddingLeft: 5,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  cartBadge: {
    width: 18,
    height: 18,
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: colors.primary,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBadge: {
    width: 18,
    height: 18,
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 2,
    height: 80,
  },
  notificationIconContainer: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    borderWidth: 1,
    borderColor: '#ececec',
    padding: 7,
    borderRadius: 25,
  },
  notificationText: {
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: 'center',
  },
  notificationCount: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    backgroundColor: '#ee4d2d',
    color: '#fff',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 5,
    fontSize: 10,
  },
  sectionHeader: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#717171',
  },
  notificationDetail: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 2,
    paddingVertical: 15,
  },
  detailIconContainer: {
    alignItems: 'center',
    width: 75,
  },
  detailIcon: {
    borderWidth: 1,
    borderColor: '#ececec',
    padding: 7,
    borderRadius: 25,
  },
  detailText: {
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: 'center',
    paddingRight: 10,
  },
  detailDate: {
    color: '#c5c5c5',
  },
  cancellationBackground: {
    backgroundColor: '#fef4f1',
  },
});

export default styles;
