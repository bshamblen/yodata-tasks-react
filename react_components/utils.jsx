var _ = require('underscore');
require('./underscore_mixins.jsx');

module.exports = {
	formatDateString(value) {
		if (value) {
			var date = new Date(value);
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
		}

		return '';
	},
	buildMongoDbUpdate(original, updated) {
		var modifier = {};

		function addModifier(op, key, val) {
			if (_.isUndefined(modifier[op])) {
				modifier[op] = {};
			}

			modifier[op][key] = val;
		}

		_.keys(updated).forEach(function(key) {
			var newVal = updated[key];
			var oldVal = original[key];

			if (!_.isEqual(newVal, oldVal)) {
				addModifier('$set', key, newVal);
			}
		});

		_.keys(original).forEach(function(key) {
			if (!_.property(key)(updated)) {
				if (!_.deepIsEmpty(original[key])) {
					addModifier('$unset', key, true);
				}
			}
		});

		return modifier;
	}
}
