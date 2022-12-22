/**
 * @typedef {{
 *    distance: google.maps.Distance;
 *    duration: google.maps.Duration;
 *    end_address: string;
 *    end_location: Pick<google.maps.LatLng, 'lat' | 'lng'>;
 *    start_address: string;
 *    start_location: Pick<google.maps.LatLng, 'lat' | 'lng'>;
 *    steps: [{
 *     distance: google.maps.Distance;
 *     duration: google.maps.Duration;
 *     end_location: Pick<google.maps.LatLng, 'lat' | 'lng'>
 *     start_location: Pick<google.maps.LatLng, 'lat' | 'lng'>
 *     html_instructions: string;
 *     polyline: google.maps.DirectionsPolyline
 *     travel_mode: google.maps.TravelMode;
 *     maneuver: string | undefined;
 *    }];
 *    traffic_speed_entry: any[];
 *    via_waypoint: google.maps.LatLng[];
 * }} MapDirectionsLegs
 */

/**
 * @typedef {{
 * url: string,
 * origin: string | LatLng,
 * destination: string | LatLng,
 * waypoints: (string | LatLng)[],
 * language: string,
 * apikey: string,
 * mode: google.maps.TravelMode,
 * region: string,
 * precision: 'low'|'high',
 * timePrecision: string,
 * channel?: string,
 * avoid?: ('TOLLS' | 'HIGHWAYS' | 'FERRIES')[],
 * index: number,
 * optimizeWaypoints: boolean
 * }} RouteOptions
 */

/**
 * @typedef {{
 *  latitude:number;
 *  longitude:number;
 * }} LatLng
 */

/**
 * @typedef {(options: {
 *  origin: string | LatLng;
 *  destination: string | LatLng;
 *  waypoints: (string | LatLng)[];
 * }) => void} OnStartFetching
 */

export {};
