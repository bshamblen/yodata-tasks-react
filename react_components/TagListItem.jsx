import React from 'react';
import {Button} from 'react-bootstrap';

module.exports = React.createClass({
	displayName: 'TagListItem',
	propTypes: {
		tag: React.PropTypes.object.isRequired,
		onTagSelect: React.PropTypes.func.isRequired
	},
	handleButtonClick() {
		this.props.onTagSelect(this.props.tag._id);
	},
	render() {
		return (
			<li>
				<Button bsStyle="default" bsSize="xsmall" className="btn-task-tag" onClick={this.handleButtonClick}>
					{this.props.tag._id} <span className="badge">{this.props.tag.count}</span>
				</Button>
			</li>
		);
	}
});
