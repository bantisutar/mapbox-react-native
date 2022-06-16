import { StyleSheet } from 'react-native'

const MapViewStyle = StyleSheet.create({
  page: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray'
  },

  map: {
    flex: 1,
    backgroundColor: 'white'
  },

  markerUserContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center'
  },
  markerContainer: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: 'white'
  }
})
export default MapViewStyle
