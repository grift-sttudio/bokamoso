module.exports = {
	globDirectory: 'assets',
	globPatterns: [
		'**/*.jpg'
	],
	swDest: 'assets/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};