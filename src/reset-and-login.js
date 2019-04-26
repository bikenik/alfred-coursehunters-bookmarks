
'use strict'
const jsonfile = require('jsonfile')

const dbFile = './src/input/db.json'

const alfy = require('alfy')

if (process.argv[3] === 'reset') {
	alfy.config.clear()
	alfy.cache.clear()
	jsonfile.writeFile(dbFile, [], {
		spaces: 2
	}, error => {
		if (error !== null) {
			console.error(error)
		}
	})
}
