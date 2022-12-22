/**
 * Decode steps from GMaps Json
 * @param {google.maps.DirectionsStep[]} steps
 * @returns {({latitude:number; longitude:number})[]}
 */
export const decode = (steps) => {
  /** @type {({latitude:number; longitude:number})[]} */
  let points = [];

  for (const step of steps) {
    const { points: encoded } = step.polyline;
    const len = encoded.length;
    let index = 0;

    const coords = {
      lat: 0,
      lng: 0,
    };

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;

      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      coords.lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      coords.lng += dlng;

      points.push({
        latitude: coords.lat / 1e5,
        longitude: coords.lng / 1e5,
      });
    }
  }

  return points;
};
