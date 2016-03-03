/** @jsx React.DOM */

var React = require('react');
var globals = require('./globals.jsx');

module.exports = React.createClass({
	displayName: 'YodataLoginButton',
	propTypes: {
		clientId: React.PropTypes.string.isRequired,
		scopes: React.PropTypes.string.isRequired,
		onUserStateChange: React.PropTypes.func.isRequired
	},
	getQueryParameterByName(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
		results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	},
	saveAuthCode() {
		var authCode = this.getQueryParameterByName('code');

		if (authCode) {
			localStorage.setItem(globals.YD_AUTH_CODE, authCode);
			this.requestAuthToken();
		}
	},
	requestAuthToken() {
		var self = this;
		var redurectUri = this.removeQueryStringParamFromURI(window.location.href, 'code');

		var params = {
			'client_id': this.state.clientId,
			'code': localStorage.getItem(globals.YD_AUTH_CODE),
			'grant_type': 'authorization_code',
			'redirect_uri': redurectUri
		}

		$.ajax({
			url : new YDClient({}).getApiUrl() + 'dialog/exchange',
			type: 'POST',
			data: params,
			success(data, textStatus, jqXHR) 
			{
				localStorage.setItem(globals.YD_AUTH_TOKEN, data.access_token);
				document.location.href = redurectUri;
			},
			error(jqXHR, textStatus, errorThrown) 
			{
				alert('An unexpected error occurred.');    
			}
		});
	},
	removeQueryStringParamFromURI(uri, qsToRemove) {
		if (uri.indexOf('?') <= 0)
			return uri;

		var queryString = uri.substring(uri.indexOf('?') + 1);
		var root = uri.substring(0, uri.indexOf('?'));
		var params = {}, oldQueries, newQueries = [], temp, i, l;

		// Split into key/value pairs
		oldQueries = queryString.split('&');

		// Convert the array of strings into an object
		for ( i = 0, l = oldQueries.length; i < l; i++ ) {
			temp = oldQueries[i].split('=');

			if (temp[0].toLowerCase() != qsToRemove.toLowerCase())
				newQueries[newQueries.length] = oldQueries[i];
		}

		return root + (newQueries.length > 0 ? '?' : '') + newQueries.join('&');
	},
	getInitialState() {
		if (this.props.authToken) {
			localStorage.setItem(globals.YD_AUTH_TOKEN, this.props.authToken);
		}

		var loggedIn = localStorage.getItem(globals.YD_AUTH_TOKEN) ? true : false;
		
		return {
			clientId: this.props.clientId,
			scopes: this.props.scopes.split(','),
			loggedIn: loggedIn
		}
	},
	handleClick() {
		if (this.state.loggedIn) {
			var self = this;

			localStorage.removeItem(globals.YD_AUTH_TOKEN);
			localStorage.removeItem(globals.YD_AUTH_CODE);

			this.setState({loggedIn: false}, function() {
				self.props.onUserStateChange(false);
			});
			
		} else {
			document.location.href = new YDClient({}).getApiUrl() + 
					'dialog/authorize?client_id=' + this.state.clientId + 
					'&response_type=code&scope=' + this.state.scopes.join(',') + 
					'&redirect_uri=' + encodeURI(window.location.href);
		}
	},
	render() {
		this.saveAuthCode();

		var buttonStyle = {
			border: 'solid 1px silver',
			fontSize: '9pt',
			borderRadius: 6,
			padding: '4px 8px 4px 8px',
			background : 'white',
			color: 'gray',
			fontWeight: 'normal',
			margin: '12px 0px 12px 0px'
		}

		var logoStyle = {
			width: 14,
			height: 14,
			marginRight: 6
		}

		return (
			<button type="button" style={buttonStyle} onClick={this.handleClick}>
				<img src="https://yodata.io/images/yodata-circle.png" style={logoStyle}/>
				{(this.state.loggedIn ? 'Log Out' : 'Log In')}
			</button>
		);
	}
});
