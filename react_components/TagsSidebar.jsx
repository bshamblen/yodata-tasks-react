/** @jsx React.DOM */

var React = require('react');
var TagListItem = require('./TagListItem.jsx');
var Panel = require('react-bootstrap').Panel;

module.exports = React.createClass({
	displayName: 'TagsSidebar',
	propTypes: {
		onTagSelect: React.PropTypes.func.isRequired,
		tags: React.PropTypes.arrayOf(React.PropTypes.object),
		selectedTag: React.PropTypes.string
	},
	getInitialState() {
		return {
			tagFilterMessage: ''
		}
	},
	handleTagSelect(tag) {
		this.setState({tagFilterMessage: tag});
		this.props.onTagSelect(tag);
	},
	handleTagClear() {
		this.setState({tagFilterMessage: ''});
		this.props.onTagSelect(null);
	},
	render() {
		if (this.props.tags && this.props.tags.length > 0) {
			var self = this;
			var tagList = this.props.tags.map(function(tag) {
				return <TagListItem key={tag._id} tag={tag} onTagSelect={self.handleTagSelect}/>
			});

			var selectedTagHeader;

			if (this.props.selectedTag) {
				selectedTagHeader = (
					<div className="alert alert-info" role="alert" onClick={this.handleTagClear}>
						<button type="button" className="close btn-tag-filter-close" aria-label="Close">x</button>
						<div>Filtering by tag: <strong>{this.props.selectedTag}</strong></div>
					</div>
				);
			}

			return (
				<div className="col-sm-3">
					<Panel header="Tags">
						{selectedTagHeader}
						<ul className="list-inline">
							{tagList}
						</ul>
					</Panel>
				</div>
			);
		}

		return null;
	}
});
