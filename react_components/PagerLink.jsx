import React from 'react';

module.exports = React.createClass({
	displayName: 'PagerLink',
	propTypes: {
		currentOffset: React.PropTypes.number.isRequired,
		pageNumber: React.PropTypes.number,
		title: React.PropTypes.string,
		text: React.PropTypes.string.isRequired
	},
	handlePagerClick() {
		if (!this.isDisabled(this.props.pageNumber)) {
			this.props.onPagerClick(this.props.pageNumber);
		}
	},
	isDisabled(pageNumber) {
		if (!pageNumber) {
			return true;
		}

		let offset = this.props.currentOffset;

		if ((offset / 10) + 1 === pageNumber) {
			return true;
		}

		return false;
	},
	render() {
		let disabled = this.isDisabled(this.props.pageNumber);

		return (
			<li className={disabled ? 'disabled': ''}>
		      <a href="#" aria-label={this.props.title} className="pager-link" title={this.props.title} onClick={this.handlePagerClick}>
		        <span aria-hidden="true">{this.props.text}</span>
		      </a>
		    </li>
		);
	}	
});
