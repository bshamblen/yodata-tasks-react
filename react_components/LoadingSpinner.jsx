import React from 'react';

module.exports = React.createClass({
	displayName: 'LoadingSpinner',
	propTypes: {
		classNames: React.PropTypes.string,
		show: React.PropTypes.bool
	},
	render() {
		if (!this.props.show) {
			return null;
		}

		let classes = 'fa fa-circle-o-notch fa-spin fa-2x ';

		if (this.props.className) {
			classes += this.props.className;
		}

		return (
			<i className={classes}></i>
		);
	}
});
