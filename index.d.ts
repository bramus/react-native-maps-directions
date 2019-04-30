// Type definitions for react-native-maps-directions 1.6
// Project: https://github.com/bramus/react-native-maps-directions
// Definitions by: Ali Oguzhan Yildiz <https://github.com/alioguzhan>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.3

import * as React from 'react';

export type MapViewDirectionsOrigin =
    | string
    | {
          latitude: number;
          longitude: number;
      };

export type MapViewDirectionsWaypoints =
    | string
    | {
          latitude: number;
          longitude: number;
      };

export type MapViewDirectionsDestination =
    | string
    | {
          latitude: number;
          longitude: number;
      };

export type MapViewDirectionsMode =
    | 'DRIVING'
    | 'BICYCLING'
    | 'TRANSIT'
    | 'WALKING';

export interface MapViewDirectionsProps {
    /**
     * The origin location to start routing from.
     */
    origin?: MapViewDirectionsOrigin;
    /**
     * Array of waypoints to use between origin and destination.
     */
    waypoints?: MapViewDirectionsWaypoints[];
    /**
     * The destination location to start routing to.
     */
    destination?: MapViewDirectionsDestination;
    /**
     * Your Google Maps API Key
     */
    apikey: string;
    /**
     * Callback that is called when the routing has started.
     */
    onStart?: (...args: any[]) => any;
    /**
     * Callback that is called when the routing has succesfully finished.
     */
    onReady?: (...args: any[]) => any;
    /**
     * Callback that is called in case the routing has failed.
     */
    onError?: (...args: any[]) => any;
    /**
     * Which transportation mode to use when calculating directions.
     * Allowed values are "DRIVING", "BICYCLING", "WALKING", and "TRANSIT".
     */
    mode?: MapViewDirectionsMode;
    /**
     * The language to use when calculating directions.
     */
    language?: string;
    /**
     * Tweak if the rendered MapView. Polyline should reset or not
     * when calculating the route between origin and destionation.
     * Set to false if you see the directions line glitching.
     */
    resetOnChange?: boolean;
    /**
     * Set it to true if you would like Google Maps to re-order all the
     * waypoints to optimize the route for the fastest route.
     * Please be aware that if this option is enabled,
     * you will be billed for a higher rate by Google
     */
    optimizeWaypoints?: boolean;
    /**
     * Base URL of the Directions Service (API) you are using.
     * By default the Google Directions API is used
     * ("https://maps.googleapis.com/maps/api/directions/json").
     * Usually you won't need to change this.
     */
    directionsServiceBaseUrl?: string;
    /**
     * If you are using strings for origin or destination,
     * sometimes you will get an incorrect route because
     * Google Maps API needs the region where this places belong to.
     */
    region?: string;
}

export default class MapViewDirections extends React.Component<
    MapViewDirectionsProps,
    any
> {
    render(): JSX.Element;
}
