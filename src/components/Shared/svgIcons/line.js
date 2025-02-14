import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Base from './base';

export default class Line extends Component {
	static propTypes = {
		height: PropTypes.string,
		predefinedClassName: PropTypes.string,
		viewBox: PropTypes.string,
		style: PropTypes.object,
	};

	static defaultProps = {
		height: '15px', // Bigger default size
		predefinedClassName: 'data-ex-icons-line',
		viewBox: '0 0 15 15',
	};

	render() {
		return (
			<Base {...this.props}>
				<line
					x1="-2"
					y1="20"
					x2="10"
					y2="-2"
					stroke="currentColor"
					strokeWidth="2" // Bold line
					strokeLinecap="round" // Smooth rounded edges
				/>
			</Base>
		);
	}
}
