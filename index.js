/* eslint no-useless-concat: "off" */
/* eslint camelcase: ["error", {properties: "never"}] */
/* eslint camelcase: ["error", {allow: ["^client_","access_token","grant_type","refresh_token"]}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }] */

'use strict'
require('dotenv').config()
const jsonFile = require('jsonfile')

const settings = require('./src/settings')
const {tags, addBookmark, playlist} = require('./src/bookmarks/add-bookmark')

const db = `${process.env.alfred_workflow_data}/db.json`
const currentDB = require(db)

switch (process.argv[3]) {
	case 'add-bookmarks':
		addBookmark(currentDB)
		break
	case 'show-tags':
		tags(currentDB)
		break
	case 'show-playlists':
		playlist(currentDB)
		break
	case 'add-tags':
		addBookmark(currentDB, process.argv[2])
		break
	case 'bookmark-update':
		jsonFile.writeFile(db, JSON.parse(process.argv[2]), {
			spaces: 2
		}, error => {
			if (error !== null) {
				console.error(error)
			}
		})
		break
	case 'reset':
		settings('!')
		break

	default:
		break
}
