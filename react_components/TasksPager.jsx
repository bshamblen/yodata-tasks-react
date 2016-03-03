/** @jsx React.DOM */

var React = require('react');
var PagerLink = require('./PagerLink.jsx');

module.exports = React.createClass({
	displayName: 'TasksPager',
	propTypes: {
		onStateChange: React.PropTypes.func.isRequired,
		meta: React.PropTypes.object,
		currentOffset: React.PropTypes.number.isRequired
	},
	handlePagerClick(pageNumber) {
		this.props.onStateChange({currentOffset: (pageNumber - 1) * 10});
	},
	render() {
		if (!this.props.meta) {
			return <span></span>;
		}

		var firstPage = this.props.meta['first-page'];
		var	prevPage = this.props.meta['prev-page'];
		var nextPage = this.props.meta['next-page'];
		var lastPage = this.props.meta['last-page'];
		var currentOffset = this.props.currentOffset;

		var commonProps = {
			currentOffset: currentOffset,
			onPagerClick: this.handlePagerClick
		}

		return (
			<nav>
			  <ul className="pagination" style={{margin:'0px'}}>
			  	<PagerLink pageNumber={firstPage} {...commonProps} title="first page" text={String.fromCharCode(171)} />
			  	<PagerLink pageNumber={prevPage} {...commonProps} title="previous page" text={String.fromCharCode(8249)} />
			  	<PagerLink pageNumber={nextPage} {...commonProps} title="next page" text={String.fromCharCode(8250)} />
			  	<PagerLink pageNumber={lastPage} {...commonProps} title="last page" text={String.fromCharCode(187)} />
			  </ul>
			</nav>
		);
	}
})