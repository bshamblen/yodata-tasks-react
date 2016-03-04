import React from 'react';

module.exports = React.createClass({
	displayName: 'UserAvatar',
	propTypes: {
		profile: React.PropTypes.object
	},
	render() {
		let profile = this.props.profile;

		if (profile && profile.avatarImageUrl) {
			return (
				<div>
					<img src={profile.avatarImageUrl} width="40" height="40" style={{marginRight:10}} className="thumbnail pull-left" />
					<span style={{lineHeight:'40px'}}>
						Welcome <strong>{profile.name ? profile.name : profile.profileName}</strong>
					</span>
					<div className="clearfix"></div>
				</div>
			);
		}

		return (
			<div>This sample application is intended to showcase the various features of the <a href="https://yodata.io" target="_blank">Yodata</a> API. To start managing your task list click the <strong>Log In</strong> button in the menu bar.</div>
		);
	}
});
