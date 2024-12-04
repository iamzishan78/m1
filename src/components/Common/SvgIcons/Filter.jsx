import * as React from 'react';

const FilterIcon = ({ variant = 'alt', ...rest }) => {
	const renderVariant = () => {
		switch (variant) {
			case 'outlined':
				return (
					<svg
						className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc"
						aria-hidden="true"
						viewBox="0 0 24 24"
						data-testid="FilterAltOutlinedIcon"
						{...rest}
					>
						<path d="M7 6h10l-5.01 6.3L7 6zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0 0 18.95 4H5.04c-.83 0-1.3.95-.79 1.61z" />
					</svg>
				);
			case 'alt':
				return (
					<svg
						className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc"
						aria-hidden="true"
						viewBox="0 0 24 24"
						data-testid="FilterAltIcon"
						{...rest}
					>
						<path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A.998.998 0 0 0 18.95 4H5.04c-.83 0-1.3.95-.79 1.61z" />
					</svg>
				);
		}
	};

	return renderVariant();
};

export default FilterIcon;
