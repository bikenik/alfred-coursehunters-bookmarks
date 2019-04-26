/* eslint no-return-assign: "error" */

'use strict'
const alfy = require('alfy')
const jsonfile = require('jsonfile')

const db = jsonfile.readFileSync('./src/input/db.json')

const currentInfo = process.env.tdb ? JSON.parse(process.env.tdb) : []
const indexToAdd = db.map((x, i) => {
	let index
	if (currentInfo.allData && x.id === currentInfo.allData.video_id) {
		index = i
	}

	return index
}).filter(x => x !== undefined)[0]

let items
let result
if (typeof (indexToAdd) === 'number') {
	items = db[indexToAdd].bookmarks.map(x => ({
		title: x.comment,
		subtitle: `${x.sequence} 🚩 ${x.title}`,
		arg: JSON.stringify({
			startsAt: x.startsAt,
			playlistIndex: x.index
		}),
		icon: {path: x.index === currentInfo.playlistIndex ? './List Filter Images/92f6721c1c5abf70d54511205a35ac71a9f06e96.png' : './List Filter Images/58935412a79da5154a007e9688a24bc88ed89533.png'},
		quicklookurl: db[indexToAdd].id,
		variables: {
			mode: x.index === currentInfo.playlistIndex ? 'lesson-playSeekTo' : 'playlist-playSeekTo'
		},
		mods: {
			fn: {
				subtitle: 'Delete this bookmark',
				icon: {path: alfy.icon.delete},
				variables: {
					time: x.startsAt,
					mode: 'by-time'
				}
			}
		}
	}))
	result = items.sort((a, b) => (JSON.parse(a.arg).startsAt > JSON.parse(b.arg).startsAt) ? 1 : ((JSON.parse(b.arg).startsAt > JSON.parse(a.arg).startsAt) ? -1 : 0))
	result = items.sort((a, b) => {
		const nameA = a.variables.mode.toUpperCase() // ignore upper and lowercase
		const nameB = b.variables.mode.toUpperCase() // ignore upper and lowercase
		if (nameA < nameB) {
			return -1
		}

		if (nameA > nameB) {
			return 1
		}

		// Names must be equal
		return 0
	})
} else if (indexToAdd === undefined || process.argv[3] === 'allBookmarks') {
	items = db.map(y => y.bookmarks
		.map(x => {
			const subtitle = `🚩 ${x.title}${`${y.playlist && y.playlist.title ? ` 📀 ${y.playlist.title}` : ''}`}${`${x.sequence ? ` 🧩 ${x.sequence}` : ''}`}`
			return {
				title: x.comment,
				subtitle,
				icon: {path: './List Filter Images/all-bookmarks.png'},
				arg: JSON.stringify({
					startsAt: x.startsAt,
					playlistIndex: x.index
				}),
				quicklookurl: y.id,
				meta: {
					tags: x.tags,
					playlist: y.playlist.title
				},
				text: {
					largetype: `${subtitle.replace(/📀/g, '\n📀').replace(/🧩/g, '\n🧩')}`
				},
				variables: {
					mode: 'playByNewTab',
					url: y.id
				},
				mods: {
					fn: {
						subtitle: 'Delete this bookmark',
						icon: {path: alfy.icon.delete},
						variables: {
							time: x.startsAt,
							mode: 'by-time'
						}
					}
				}
			}
		}
		))
	result = items.reduce((arr, allArr) => [...arr, ...allArr], []).reverse()
}

if (process.argv[3] === 'by-tags') {
	const currenttags = JSON.parse(process.env.tags)
	result = result.filter(x => x.meta.tags && x.meta.tags.filter(y => y === currenttags[0]).length > 0)
	result.forEach(x => {
		x.icon.path = './List Filter Images/78303f403137dc57c4f5809e177bd5f46b892d0f.png'
		x.mods = {
			fn: {
				subtitle: `Delete all bookmarks with "${process.env.tags.toUpperCase()}" tag`,
				icon: {path: alfy.icon.delete},
				variables: {
					mode: 'by-tag'
				}
			}
		}
	})
}

if (process.argv[3] === 'playlist') {
	result = result.filter(x => x.meta.playlist === process.env.playlist)
	result.forEach(x => {
		x.icon.path = './List Filter Images/f54766acb7bc462bd0e0bc1a34b9dab62ca0d383.png'
		x.mods = {
			fn: {
				subtitle: `Delete all bookmarks in "${x.meta.playlist}" playlist`,
				icon: {path: alfy.icon.delete},
				variables: {
					mode: 'by-playlist',
					playlist: x.meta.playlist
				}
			}
		}
	})
}

alfy.input = alfy.input.replace(/.*?‣ /g, '')
alfy.output(alfy.inputMatches(result, 'title'))
