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
            steps: null
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
		if (!isEqual(nextProps.origin, this.props.origin) || !isEqual(nextProps.destination, this.props.destination) || !isEqual(nextProps.waypoints, this.props.waypoints)) {
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
		for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
			a = null, h = 0, i = 0;
			do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
			n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;
			do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
			o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]);
		}

		return d = d.map(function(t) {
			return {
				latitude: t[0],
				longitude: t[1],
			};
		});
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
                        durationText: route.legs[0].duration.text,
                        coordinates: this.decode(route.overview_polyline.points),
                        steps: route.legs[0].steps
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
			origin, // eslint-disable-line no-unused-vars
			waypoints, // eslint-disable-line no-unused-vars
			destination, // eslint-disable-line no-unused-vars
			apikey, // eslint-disable-line no-unused-vars
			onReady, // eslint-disable-line no-unused-vars
			onError, // eslint-disable-line no-unused-vars
			mode, // eslint-disable-line no-unused-vars
            language, // eslint-disable-line no-unused-vars
            autoTransitColor, // eslint-disable-line no-unused-vars
			...props
        } = this.props;
        
        const {
            coordinates,
			distance,
            duration,
            steps
        } = this.state;

        if (autoTransitColor) {
            return steps.map((step, index) => {
                let color = this.props.strokeColor;
                if (step.travel_mode == "TRANSIT") {
                    color = step.transit_details.line.color
                }

                return (
                    <MapView.Polyline key={index} coordinates={this.decode(step.polyline.points)} {...props} strokeColor={color} />
                );
            })
        } else {
            return (
                <MapView.Polyline coordinates={coordinates} {...props} />
            );
        }
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
    autoTransitColor: PropTypes.bool,
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
