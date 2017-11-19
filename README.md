# `react-native-maps-directions` [![npm version](https://img.shields.io/npm/v/react-native-maps-directions.svg?style=flat)](https://www.npmjs.com/package/react-native-maps-directions)

Directions component for [`react-native-maps`](https://github.com/airbnb/react-native-maps/)

## Installation

```
yarn add react-native-maps-directions
```

## Prerequisites

The Google Maps Directions API is used for the routing. Therefore [a Google Maps API Key](https://developers.google.com/maps/documentation/directions/get-api-key) is required.

## Usage

Import `MapViewDirections` and render an instance as a child of a `MapView` component.

Its properties are:

- `origin`: The origin coordinate
- `destination`: The destination coordinate
- `apikey`: Your Google Maps API Key

```js
<MapView initialRegion={…}>
  <MapViewDirections
    origin={origin}
    destination={destination}
    apikey={GOOGLE_MAPS_APIKEY}
  />
</MapView>
```

Coordinates can be objects with `latitude` and `longitude` keys, or a string in the format `'latitude,longitude'`.

Once the directions from both coordinates has been fetched, a `MapView.Polyline` between the two will be drawn. Therefore all [`MapView.Polyline` props](https://github.com/airbnb/react-native-maps/blob/master/docs/polyline.md#props) – except for `coordinates` – are also accepted.

```js
<MapView initialRegion={…}>
  <MapViewDirections
    origin={origin}
    destination={destination}
    apikey={GOOGLE_MAPS_APIKEY}
    strokeWidth={3}
    strokeColor="hotpink"
  />
</MapView>
```

## Full Example

```js
import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const coordinates = [
  {
    latitude: 37.798790,
    longitude: -122.442753,
  },
  {
    latitude: 37.790651,
    longitude: -122.422497,
  },
];

const GOOGLE_MAPS_APIKEY = '…';

class Example extends Component {
  render() {
    return (
      <MapView
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        style={StyleSheet.absoluteFill}
      >
        <MapView.Marker coordinate={coordinates[0]} />
        <MapView.Marker coordinate={coordinates[1]} />
        <MapViewDirections origin={coordinates[0]} destination={coordinates[1]} apikey={GOOGLE_MAPS_APIKEY} strokeWidth={3} strokeColor="hotpink" />
      </MapView>
    );
  }
}

export default Example;
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Credits

- Bram(us) Van Damme <em>([https://www.bram.us/](https://www.bram.us/))</em>
- [All Contributors](../../contributors)

This code is inspired upon the article [React Native Maps with Google Directions Api](https://medium.com/@ali_oguzhan/react-native-maps-with-google-directions-api-bc716ed7a366) by Ali Oğuzhan Yıldız.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
