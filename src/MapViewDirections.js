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
		this.fetchAndRenderRoute(this.props);
	}

	componentDidUpdate(prevProps) {
		if (!isEqual(prevProps.origin, this.props.origin) || !isEqual(prevProps.destination, this.props.destination) || !isEqual(prevProps.waypoints, this.props.waypoints) || !isEqual(prevProps.mode, this.props.mode) || !isEqual(prevProps.precision, this.props.precision)) {
			if (this.props.resetOnChange === false) {
				this.fetchAndRenderRoute(this.props);
			} else {
				this.resetState(() => {
					this.fetchAndRenderRoute(this.props);
				});
			}
		}
	}

	resetState = (cb = null) => {
		this.setState({
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
					b = encoded.charAt(index++).charCodeAt(0) - 63;
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
			mode = 'DRIVING',
			language = 'en',
			optimizeWaypoints,
			directionsServiceBaseUrl = 'https://maps.googleapis.com/maps/api/directions/json',
			region,
			precision = 'low',
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

		if (optimizeWaypoints) {
			waypoints = `optimize:true|${waypoints}`;
		}

		onStart && onStart({
			origin,
			destination,
			waypoints: waypoints ? waypoints.split('|') : [],
		});

		this.fetchRoute(directionsServiceBaseUrl, origin, waypoints, destination, apikey, mode, language, region, precision)
			.then(result => {
				this.setState(result);
				onReady && onReady(result);
			})
			.catch(errorMessage => {
				this.resetState();
				console.warn(`MapViewDirections Error: ${errorMessage}`); // eslint-disable-line no-console
				onError && onError(errorMessage);
			});
	}

	fetchRoute(directionsServiceBaseUrl, origin, waypoints, destination, apikey, mode, language, region, precision) {

		// Define the URL to call. Only add default parameters to the URL if it's a string.
		let url = directionsServiceBaseUrl;
		if (typeof (directionsServiceBaseUrl) === 'string') {
			url += `?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode.toLowerCase()}&language=${language}&region=${region}&departure_time=now`;
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
							return carry + (curr.duration_in_traffic ? curr.duration_in_traffic.value : curr.duration.value);
						}, 0) / 60,
						coordinates: (
							(precision === 'low') ?
							this.decode([{polyline: route.overview_polyline}]) :
							route.legs.reduce((carry, curr) => {
								return [
									...carry,
									...this.decode(curr.steps),
								];
							}, [])
						),
						fare: route.fare,
					});

				} else {
					return Promise.reject();
				}
			})
			.catch(err => {
				console.warn(
					'react-native-maps-directions Error on GMAPS route request',
					err
				);
			});
	}

	render() {
		if (!this.state.coordinates) {
			return null;
		}

		const {
			origin, // eslint-disable-line no-unused-vars
			waypoints, // eslint-disable-line no-unused-vars
			destination, // eslint-disable-line no-unused-vars
			apikey, // eslint-disable-line no-unused-vars
			onReady, // eslint-disable-line no-unused-vars
			onError, // eslint-disable-line no-unused-vars
			mode, // eslint-disable-line no-unused-vars
			language, // eslint-disable-line no-unused-vars
			region,
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
	mode: PropTypes.oneOf(['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING']),
	language: PropTypes.string,
	resetOnChange: PropTypes.bool,
	optimizeWaypoints: PropTypes.bool,
	directionsServiceBaseUrl: PropTypes.string,
	region: PropTypes.string,
	precision: PropTypes.oneOf(['high', 'low']),
};

export default MapViewDirections;
