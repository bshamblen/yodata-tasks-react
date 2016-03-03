(function() {
	/*
	* yodata.client.js v0.0.21
	* https://github.com/Yodata/yodata-client-js
	*/

	// Base object, `window` in the browser, `exports` in node.
	var base = this;

	var request = null;

	if (typeof Npm !== 'undefined') { //test for Meteor Npm.require object
		request = Npm.require('request');
	} else if (typeof require !== 'undefined') { //test for node.js require object
		request = require('request');
	}

	// Root URL of the yodata API server
	var YD_API_BASE_URL = 'https://api.yodata.io/';

	var client = function yodataClient(options) {
		this.authToken = options.authToken;
		this.clientId = options.clientId;
		this.clientSecret = options.clientSecret;
		this._authStateChangeHandler = undefined;

		if (typeof window !== 'undefined' && this.clientSecret) {
			throw new Error('Use of Client Password authentication not supported in browser.')
		}
	}

	// API enpoint functions
	// ---------------------
	client.prototype.executeApiCall = function(url, type, doc, callback) {
		var self = this;

		if (self.authToken) {
			if (typeof window !== 'undefined') {
				$.ajax({
					url : url,
					type: type,
					data : doc,
					cache: false,
					headers: { 'Authorization' : 'Bearer ' + self.authToken },
					success:function(res, textStatus, jqXHR) {
						callback(null, res);
					},
					error: function(res, textStatus, errorThrown) {
						if (res.responseJSON && Object.keys(res.responseJSON).length > 0) {
							callback(res.responseJSON, null);
						} else {
							callback({
								error: {
									code: res.status,
									name: textStatus,
									message: errorThrown
								}
							}, null);
						}
					}
				});
			} else {
				var options = {
					url: url,
					method: type,
					headers: {
						'Authorization' : 'Bearer ' + self.authToken
					}
				}

				if (doc) {
					options['json'] = true;
					options['body'] = doc;
				}

				request(options, function(err, response, body) {
					err = parseError(err, response, body);

					if (err) {
						body = null;
					}

					callback(err, parseBody(body));
				});

			}
		} else if (self.clientId && self.clientSecret) {
			url += appendQueryParam(url, 'client_id', encodeURIComponent(self.clientId));
			url += appendQueryParam(url, 'client_secret', encodeURIComponent(self.clientSecret));

			var options = {
				url: url,
				method: type
			}

			if (doc) {
				options['json'] = true;
				options['body'] = doc;
			}

			request(options, function(err, response, body) {
				err = parseError(err, response, body);

				if (err) {
					body = null;
				}

				callback(err, parseBody(body));
			});
		} else {
			callback(new Error('User is not logged in'), null);
		}
	}

	client.prototype.userProfile = function(callback) {
		this.executeApiCall(YD_API_BASE_URL + 'user/profile/', 'GET', null, callback);
	}

	client.prototype.uploadFile = function(formData, callback) {
		var self = this;

		if (self.authToken) {
			if (typeof window !== 'undefined') {
				$.ajax({
					url : YD_API_BASE_URL + 'files/v1/insert',
					type: 'POST',
					data : formData,
					//cache: false,
					dataType: 'json',
					processData: false,
					contentType: false,
					headers: { 'Authorization' : 'Bearer ' + self.authToken },
					success:function(res, textStatus, jqXHR) {
						callback(null, res);
					},
					error: function(res, textStatus, errorThrown) {
						if (res.responseJSON && Object.keys(res.responseJSON).length > 0) {
							callback(res.responseJSON, null);
						} else {
							callback({
								error: {
									code: res.status,
									name: textStatus,
									message: errorThrown
								}
							}, null);
						}
					}
				});
			} else {
				var options = {
					url: YD_API_BASE_URL + 'files/v1/insert',
					method: 'POST',
					headers: { 'Authorization' : 'Bearer ' + self.authToken },
					formData: formData
				}

				request(options, function(err, response, body) {
					err = parseError(err, response, body);

					if (err) {
						body = null;
					}

					callback(err, parseBody(body));
				});
			}
		} else if (self.clientId && self.clientSecret) {
			var url = YD_API_BASE_URL + 'files/v1/insert';
			url += appendQueryParam(url, 'client_id', encodeURIComponent(self.clientId));
			url += appendQueryParam(url, 'client_secret', encodeURIComponent(self.clientSecret));

			var options = {
				url: url,
				method: 'POST',
				formData: formData
			}

			request(options, function(err, response, body) {
				err = parseError(err, response, body);

				if (err) {
					body = null;
				}

				callback(err, parseBody(body));
			});
		} else {
			callback(new Error('User is not logged in'), null);
		}
	}

	client.prototype.generateDownloadUrlForPrivateFileById = function(fileId, callback) {
		this.executeApiCall(YD_API_BASE_URL + 'files/v1/findById/' + fileId + '?request_token=true', 'GET', null, function(err, result) {
			if (err) {
				callback(err, null);
			} else if (result) {
				var downloadToken = result.downloadToken;

				if (downloadToken) {
					callback(null, YD_API_BASE_URL + 'files/v1/download/' + downloadToken);
				} else {
					callback(new Error('missing download token'), null);
				}
			}
		});
	}

	client.prototype.insert = function(modelId, doc, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = {};
		}

		var validParams = ['criteria', 'populate', 'fields', 'mapId'];
		var url = addOptionsToQueryString(urlForModel(modelId) + 'insert/', options, validParams);
		this.executeApiCall(url, 'POST', doc, callback);
	}

	client.prototype.save = function(modelId, doc, callback) {
		if (!doc.objectId) {
			callback(new Error('MissingObjectId'), null);
		} else {
			this.executeApiCall(urlForModel(modelId) + 'save/' + doc.objectId, 'PUT', doc, callback);
		}
	}

	client.prototype.update = function(modelId, objectId, modifier, callback) {
		var url = urlForModel(modelId) + 'update/' + objectId;
		url += appendQueryParam(url, 'modifier', encodeURIComponent(JSON.stringify(modifier)));
		this.executeApiCall(url, 'PATCH', null, callback);
	}

	client.prototype.remove = function(modelId, objectIds, callback) {
		if (!objectIds) {
			callback(new Error('MissingObjectId'), null);
		} else {
			var list = (Array.isArray(objectIds) ? objectIds.join(',') : objectIds);
			this.executeApiCall(urlForModel(modelId) + 'remove/' + list, 'DELETE', null, callback);
		}
	}

	client.prototype.findOne = function(modelId, options, callback) {
		var validParams = ['criteria', 'populate', 'fields', 'mapId'];
		var url = addOptionsToQueryString(urlForModel(modelId) + 'findOne/', options, validParams);
		this.executeApiCall(url, 'GET', null, callback);
	}

	client.prototype.findById = function(modelId, objectId, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = {};
		}

		var validParams = ['populate', 'fields', 'mapId'];
		var url = addOptionsToQueryString(urlForModel(modelId) + 'findById/' + objectId, options, validParams);
		this.executeApiCall(url, 'GET', null, callback);
	}

	client.prototype.find = function(modelId, options, callback) {
		var validParams = ['criteria', 'limit', 'offset', 'sort', 'fields', 'populate', 'mapId'];
		var url = addOptionsToQueryString(urlForModel(modelId) + 'find/', options, validParams);
		this.executeApiCall(url, 'GET', null, callback);
	}

	client.prototype.count = function(modelId, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = {};
		}

		var validParams = ['criteria'];
		var url = addOptionsToQueryString(urlForModel(modelId) + 'count/', options, validParams);
		this.executeApiCall(url, 'GET', null, callback);
	}

	client.prototype.distinct = function(modelId, options, callback) {
		var validParams = ['criteria', 'sort', 'fields'];
		var url = addOptionsToQueryString(urlForModel(modelId) + 'distinct/', options, validParams);
		this.executeApiCall(url, 'GET', null, callback);
	}

	client.prototype.aggregate = function(modelId, options, callback) {
		var validParams = ['pipeline'];
		var url = addOptionsToQueryString(urlForModel(modelId) + 'aggregate/', options, validParams);
		this.executeApiCall(url, 'GET', null, callback);
	}

	function addOptionsToQueryString(url, options, validParams) {
		if (!options) {
			return url;
		}

		if (validParams.indexOf('pipeline') !== -1 && options.pipeline) {
			url += appendQueryParam(url, 'pipeline', encodeURIComponent(JSON.stringify(options.pipeline)));
		}

		if (validParams.indexOf('match') !== -1 && options.match) {
			url += appendQueryParam(url, 'match', encodeURIComponent(JSON.stringify(options.match)));
		}

		if (validParams.indexOf('group') !== -1 && options.group) {
			url += appendQueryParam(url, 'group', encodeURIComponent(JSON.stringify(options.group)));
		}

		if (validParams.indexOf('criteria') !== -1 && options.criteria) {
			url += appendQueryParam(url, 'criteria', encodeURIComponent(JSON.stringify(options.criteria)));
		}

		if (validParams.indexOf('limit') !== -1 && options.limit) {
			url += appendQueryParam(url, 'limit', options.limit);
		}

		if (validParams.indexOf('offset') !== -1 && options.offset) {
			url += appendQueryParam(url, 'offset', options.offset);
		}

		if (validParams.indexOf('sort') !== -1 && options.sort) {
			url += appendQueryParam(url, 'sort', encodeURIComponent(JSON.stringify(options.sort)));
		}

		if (validParams.indexOf('fields') !== -1 && options.fields) {
			var list = (isArray(options.fields) ? options.fields.join(',') : options.fields);
			url += appendQueryParam(url, 'fields', list);
		}

		if (validParams.indexOf('populate') !== -1 && options.populate) {
			url += appendQueryParam(url, 'populate', encodeURIComponent(JSON.stringify(options.populate)));
		}

		return url;
	}

	// Generic helper functions
	// ------------------------
	client.prototype.getApiUrl = function() {
		return YD_API_BASE_URL;
	}

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	function urlForModel(modelId) {
		if (modelId === 'files') {
			return YD_API_BASE_URL + 'files/v1/';
		} else {
			return YD_API_BASE_URL + 'model/' + modelId + '/v1/';
		}
	}

	function parseBody(body) {
		if (!body) {
			return body;
		}

		if (typeof body === 'object') {
			return body;
		}

		try {
			return JSON.parse(body);
		} catch (err) {
			return null;
		}
	}

	function parseError(err, response, body) {
		if (err) {
			return err;
		}

		if (response.statusCode < 200 || response.statusCode >= 300) {
			try {
				body = JSON.parse(body);
			} catch (err) {
				//
			}

			if (typeof body === 'object' && Object.keys(body).length > 0) {
				if (body.error && body.error.message) {
					return new Error(body.error.message);
				} else {
					return body;
				}
			} else if (typeof body === 'string') {
				return new Error(body);
			} else if (response.statusMessage) {
				return new Error(response.statusMessage);
			}
		}

		return null;
	}

	function appendQueryParam(url, key, value) {
		return (url.indexOf('?') === -1 ? '?' : '&') + key + '=' + value;
	}

	if (typeof Package !== 'undefined') {
		YDClient = client;
	} else if (typeof define === 'function' && define.amd) {
		define('YDClient', [], function() {
			return client;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = client;
	} else {
		base.YDClient = client;
	}
}.call(this));
