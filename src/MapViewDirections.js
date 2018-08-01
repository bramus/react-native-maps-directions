import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import isEqual from 'lodash.isequal';

class MapViewDirections extends Component {

	constructor(props) {
		super(props);

		this.state = {
			coordinates: null,
			distance: null,
			duration: null,
		};
	}

	componentDidMount() {
		this._mounted = true;
		this.fetchAndRenderRoute(this.props);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	componentWillReceiveProps(nextProps) {
		if (!isEqual(nextProps.origin, this.props.origin) || !isEqual(nextProps.destination, this.props.destination) || !isEqual(nextProps.waypoints, this.props.waypoints) || !isEqual(nextProps.mode, this.props.mode)) {
			if (nextProps.resetOnChange === false) {
				this.fetchAndRenderRoute(nextProps);
			} else {
				this.resetState(() => {
					this.fetchAndRenderRoute(nextProps);
				});
			}
		}
	}

	resetState = (cb = null) => {
		this._mounted && this.setState({
			coordinates: null,
			distance: null,
			duration: null,
		}, cb);
	}

	decode(t, e) {
        let points = [];
        for (let step of t) {
            let encoded = step.polyline.points;
            let index = 0, len = encoded.length;
            let lat = 0, lng = 0;
            while (index < len) {
                let b, shift = 0, result = 0;
                do {
                    b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);

                let dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
                lat += dlat;
                shift = 0;
                result = 0;
                do {
                    b = encoded.charAt(index++).charCodeAt(0) - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                let dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
                lng += dlng;

                points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) })
            }
        }
        return points;
	}

	fetchAndRenderRoute = (props) => {

		let {
			origin,
			destination,
			waypoints,
			apikey,
			onStart,
			onReady,
			onError,
			mode = 'driving',
			language = 'en',
			directionsServiceBaseUrl = 'https://maps.googleapis.com/maps/api/directions/json',
		} = props;

		if (!origin || !destination) {
			return;
		}

		if (origin.latitude && origin.longitude) {
			origin = `${origin.latitude},${origin.longitude}`;
		}

		if (destination.latitude && destination.longitude) {
			destination = `${destination.latitude},${destination.longitude}`;
		}

		if (!waypoints || !waypoints.length) {
			waypoints = '';
		} else {
			waypoints = waypoints
				.map(waypoint => (waypoint.latitude && waypoint.longitude) ? `${waypoint.latitude},${waypoint.longitude}` : waypoint)
				.join('|');
		}

		onStart && onStart({
			origin,
			destination,
			waypoints: waypoints ? waypoints.split('|') : [],
		});

		this.fetchRoute(directionsServiceBaseUrl, origin, waypoints, destination, apikey, mode, language)
			.then(result => {
				if (!this._mounted) return;
				this.setState(result);
				onReady && onReady(result);
			})
			.catch(errorMessage => {
				this.resetState();
				console.warn(`MapViewDirections Error: ${errorMessage}`); // eslint-disable-line no-console
				onError && onError(errorMessage);
			});
	}

	fetchRoute(directionsServiceBaseUrl, origin, waypoints, destination, apikey, mode, language) {

		// Define the URL to call. Only add default parameters to the URL if it's a string.
		let url = directionsServiceBaseUrl;
		if (typeof (directionsServiceBaseUrl) === 'string') {
			url += `?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode}&language=${language}`;
		}

		return fetch(url)
			.then(response => response.json())
			.then(json => {

				if (json.status !== 'OK') {
					const errorMessage = json.error_message || 'Unknown error';
					return Promise.reject(errorMessage);
				}

				if (json.routes.length) {

					const route = json.routes[0];

					return Promise.resolve({
						distance: route.legs.reduce((carry, curr) => {
							return carry + curr.distance.value;
						}, 0) / 1000,
						duration: route.legs.reduce((carry, curr) => {
							return carry + curr.duration.value;
						}, 0) / 60,
                        coordinates: this.decode(route.legs[0].steps),
						fare: route.fare
					});

				} else {
					return Promise.reject();
				}
			});
	}

	render() {
		if (!this.state.coordinates) {
			return null;
		}

		const {
			origin, // eslint-disable-line no-unused-lets
			waypoints, // eslint-disable-line no-unused-lets
			destination, // eslint-disable-line no-unused-lets
			apikey, // eslint-disable-line no-unused-lets
			onReady, // eslint-disable-line no-unused-lets
			onError, // eslint-disable-line no-unused-lets
			mode, // eslint-disable-line no-unused-lets
			language, // eslint-disable-line no-unused-lets
			...props
		} = this.props;

		return (
			<MapView.Polyline coordinates={this.state.coordinates} {...props} />
		);
	}

}

MapViewDirections.propTypes = {
	origin: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.shape({
			latitude: PropTypes.number.isRequired,
			longitude: PropTypes.number.isRequired,
		}),
	]),
	waypoints: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				latitude: PropTypes.number.isRequired,
				longitude: PropTypes.number.isRequired,
			}),
		]),
	),
	destination: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.shape({
			latitude: PropTypes.number.isRequired,
			longitude: PropTypes.number.isRequired,
		}),
	]),
	apikey: PropTypes.string.isRequired,
	onStart: PropTypes.func,
	onReady: PropTypes.func,
	onError: PropTypes.func,
	mode: PropTypes.oneOf(['driving', 'bicycling', 'transit', 'walking']),
	language: PropTypes.string,
	resetOnChange: PropTypes.bool,
	directionsServiceBaseUrl: PropTypes.string,
};

export default MapViewDirections;
