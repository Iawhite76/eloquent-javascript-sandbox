const Talks = {
	talks: Object.create(null),

	setTalks(talksObject) {
		this.talks = talksObject;
	},

	getTalks() {
		return this.talks;
	}
}

module.exports = Talks;