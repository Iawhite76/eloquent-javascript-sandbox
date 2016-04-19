var Changes = {
	changes: [],

	pushChange(update) {
		this.changes.push(update)
	},

	getChanges() {
		return this.changes;
	}
}

module.exports = Changes;