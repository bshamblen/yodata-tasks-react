/** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');
var YodataTasks = require('./YodataTasks.jsx');

ReactDOM.render(
	<YodataTasks />,
	document.getElementById('site-wrapper')
);