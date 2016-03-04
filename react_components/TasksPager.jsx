import React from 'react';
import PagerLink from './PagerLink.jsx';

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
			return null;
		}

		let firstPage = this.props.meta['first-page'];
		let	prevPage = this.props.meta['prev-page'];
		let nextPage = this.props.meta['next-page'];
		let lastPage = this.props.meta['last-page'];
		let currentOffset = this.props.currentOffset;

		let commonProps = {
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