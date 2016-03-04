import _ from 'underscore';

_.mixin({
	/*
	 * removes root level properties that are falsey (null, undefined, false, 0), from an object (shallow)
	 */
	compactObject(o) {
		_.each(o, (v, k) => {
			if (!v && !_.isBoolean(v)) {
				delete o[k];
			}
		});

		return o;
	},
	/*
	 * recursively searches the object to see if all properties are falsey
	 */
	deepIsEmpty(o) {
		if (_.isNumber(o)) {
			return false;
		}

		if (_.isBoolean(o)) {
			return !o;
		}

		if (_.isEmpty(o)) {
			return true;
		}

		if (_.isObject(o)) {
			let isEmpty = true;

			_.each(o, (v, k) => {
				if (!_.deepIsEmpty(v)) {
					isEmpty = false;
				}
			});

			return isEmpty;
		} else {
			return false;
		}
	}
});
