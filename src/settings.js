'use strict'

const alfy = require('alfy')

module.exports = input => {
	if (/^!.*/.test(input)) {
		alfy.output([{
			title: 'reset all tags and bookmarks',
			subtitle: 'hit ↵ to reset',
			icon: {path: './List Filter Images/4691613d5629fcba4730226e2575d85b1cfc2e39.png'},
			variables: {
				settingMode: 'reset'
			}
		}])
	} else {
		return 'adjusted'
	}
}
