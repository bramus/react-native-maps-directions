declare module "react-native-maps-directions" {
  // Type definitions for react-native-maps-directions 1.6
  // Project: https://github.com/bramus/react-native-maps-directions
  // Definitions by: Ali Oguzhan Yildiz <https://github.com/alioguzhan>
  // Definitions by: Chris Shaffer (methodbox)<https://github.com/methodbox>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
  // TypeScript Version: 3.3

  import * as React from "react";

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
    | "DRIVING"
    | "BICYCLING"
    | "TRANSIT"
    | "WALKING";

  export type MapViewDirectionsPrecision =
    | "high"
    | "low";

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
     * The precision to draw the polyline with.
     * Allowed values are "high", and "low".
     * Defaults to "low"
     */
    precision?: MapViewDirectionsPrecision;
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
    /**
     * @number
     * The stroke width to use for the path - the line displayed
     * by polyline between two navigation points.
     * Default: 1
     */
    strokeWidth?: number;
    /**
     * @string
     * The stroke color to use for the path.
     * Default: "#000"
     */
    strokeColor?: string;
    /**
     * @Array
     * The stroke colors to use for the path (iOS only).
     * Must be the same length as coordinates.
     * Default: null
     */
    strokeColors?: Array<string>;
    /**
     * @string
     * The line cap style to apply to the open ends of the path.
     * Possible values are butt, round or square.
     * Note: lineCap is not yet supported for GoogleMaps provider on iOS.
     * Default: "round"
     */
    lineCap?: string;
    /**
     * @string
     * The line join style to apply to corners of the path.
     * Possible values are miter, round or bevel.
     * Default: "round"
     */
    lineJoin?: string;
    /**
     * @number
     * The limiting value that helps avoid spikes at junctions
     * between connected line segments. The miter limit helps you avoid
     * spikes in paths that use the miter lineJoin style. If the ratio of
     * the miter length—that is, the diagonal length of the miter join—to
     * the line thickness exceeds the miter limit, the joint is converted
     * to a bevel join. The default miter limit is 10, which results in the
     * conversion of miters whose angle at the joint is less than 11 degrees.
     */
    miterLimit?: number;
    /**
     * @boolean
     * Boolean to indicate whether to draw each segment of the line as a geodesic
     * as opposed to straight lines on the Mercator projection. A geodesic is the
     * shortest path between two points on the Earth's surface.
     * The geodesic curve is constructed assuming the Earth is a sphere.
     */
    geodesic?: boolean;
    /**
     * @number
     * (iOS only) The offset (in points) at which to start drawing the
     * dash pattern. Use this property to start drawing a dashed line
     * partway through a segment or gap. For example, a phase value of 6 for
     * the patter 5-2-3-2 would cause drawing to begin in the middle of the first gap.
     * Default: 0
     */
    lineDashPhase?: number;
    /**
     * @Array
     * An array of numbers specifying the dash pattern to use for the path.
     * The array contains one or more numbers that indicate the lengths (measured in points)
     * of the line segments and gaps in the pattern. The values in the array alternate,
     * starting with the first line segment length, followed by the first gap length,
     * followed by the second line segment length, and so on.
     * Default: null
     */
    lineDashPattern?: Array<number>;
    /**
     * @boolean
     * Boolean to allow a polyline to be tappable and use the onPress function.
     */
    tappable?: boolean;
  }

  export default class MapViewDirections extends React.Component<
    MapViewDirectionsProps,
    any
  > {
    render(): JSX.Element;
  }
}
