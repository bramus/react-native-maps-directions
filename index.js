import { NativeModules, Platform } from 'react-native'
import MapViewDirectionsJS from './src/MapViewDirections'

export default MapViewDirectionsJS

const { MapViewDirections } = NativeModules

export const getDirectionsFromMapKit = (origin, destination) => {
  if (Platform.OS === 'ios') {
    return MapViewDirections.getDirections(origin, destination)
  } else {
    return []
  }
}
