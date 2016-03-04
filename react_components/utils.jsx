import _ from 'underscore';
import './underscore_mixins.jsx';

module.exports = {
	formatDateString(value) {
		if (value) {
			let date = new Date(value);
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
		}

		return '';
	},
	buildMongoDbUpdate(original, updated) {
		let modifier = {};

		let addModifier = (op, key, val) => {
			if (_.isUndefined(modifier[op])) {
				modifier[op] = {};
			}

			modifier[op][key] = val;
		}

		_.keys(updated).forEach((key) => {
			let newVal = updated[key];
			let oldVal = original[key];

			if (!_.isEqual(newVal, oldVal)) {
				addModifier('$set', key, newVal);
			}
		});

		_.keys(original).forEach((key) => {
			if (!_.property(key)(updated)) {
				if (!_.deepIsEmpty(original[key])) {
					addModifier('$unset', key, true);
				}
			}
		});

		return modifier;
	}
}
