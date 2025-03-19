import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class Point extends Component {
	static propTypes = {
		height: PropTypes.string,
		predefinedClassName: PropTypes.string,
		viewBox: PropTypes.string,
		style: PropTypes.object,
	};

	static defaultProps = {
		height: '16px',
		predefinedClassName: 'data-ex-icons-point',
		viewBox: '0 0 16 16',
	};

	render() {
		return (
			<Base {...this.props}>
				<circle
					cx="8"
					cy="8"
					r="5"
					fill="currentColor" // Filled circle
				/>
			</Base>
		);
	}
}
