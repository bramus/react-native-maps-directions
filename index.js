import { NativeModules, Platform } from 'react-native'
import MapViewDirectionsJS from './src/MapViewDirections'

const { MapViewDirections } = NativeModules

export const getDirectionsFromMapKit = (origin, destination) => {
  if (Platform.OS === 'ios') {
    return MapViewDirections.getDirections(origin, destination)
  } else {
    return []
  }
}

export default MapViewDirectionsJS
