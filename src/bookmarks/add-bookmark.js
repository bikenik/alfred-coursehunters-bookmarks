/* eslint no-return-assign: "error" */

const alfy = require('alfy')

const addBookmark = currentDB => {
	let myvar
	let currentInfo
	if (process.env.tdb) {
		currentInfo = JSON.parse(process.env.tdb)
		myvar = {
			bookmarks: [{
				comment: process.env.input ? process.env.input : alfy.input,
				tags: process.env.tags ? JSON.parse(process.env.tags) : null,
				startsAt: currentInfo.currentTime,
				sequence: currentInfo.playlist.sequence,
				title: currentInfo.allData.title,
				index: currentInfo.playlistIndex
			}],
			id: currentInfo.allData.video_id,
			owner: currentInfo.allData.author,
			playlist: {
				title: currentInfo.playlist.title
			}
		}
	}

	const DB = currentDB
	const indexToAdd = DB.map((x, i) => {
		let index
		if (x.id === currentInfo.allData.video_id) {
			index = i
		}

		return index
	}).filter(x => x !== undefined)[0]
	if (typeof (indexToAdd) === 'number') {
		DB[indexToAdd].bookmarks.push(
			myvar.bookmarks[0]
		)
	} else {
		DB.push(myvar ? myvar : '')
	}

	alfy.output([{
		title: 'add your bookmark',
		arg: JSON.stringify(DB),
		icon: {path: './List Filter Images/58935412a79da5154a007e9688a24bc88ed89533.png'},
		variables: {mode: 'regular'}
	},
	{
		title: process.env.tags ? process.env.tags : 'add some tags',
		icon: {path: './List Filter Images/78303f403137dc57c4f5809e177bd5f46b892d0f.png'},
		variables: {
			mode: 'show-tags',
			input: alfy.input
		}
	}])
}

const tags = currentDB => {
	const tags = currentDB.map(y => y.bookmarks
		.filter(x => x.tags).map(x => x.tags).reduce((arr, allArr) => [...arr, ...allArr], [])).reduce((arr, allArr) => [...arr, ...allArr], [])
	const result = [...new Set(tags)].map(x => {
		return (x = {
			title: x,
			icon: {path: './List Filter Images/78303f403137dc57c4f5809e177bd5f46b892d0f.png'},
			autocomplete: x,
			arg: JSON.stringify([x])
		})
	})
	alfy.input = alfy.input.replace(/.*?‣ /g, '')
	const items = alfy.inputMatches(result, 'title')
	if (items.length === 0) {
		const tags = alfy.input.split(',').map(x => x.trim())
		items.push({
			title: `new tag will: '${alfy.input}'`,
			arg: JSON.stringify(tags),
			icon: {path: './List Filter Images/78303f403137dc57c4f5809e177bd5f46b892d0f.png'}
		})
	}

	if (process.env.tags) {
		const currenttags = JSON.parse(process.env.tags)
		items.forEach(x => {
			x.arg = JSON.stringify(currenttags.concat(JSON.parse(x.arg)))
		})
	}

	alfy.output(items)
}

const playlist = currentDB => {
	const playlists = currentDB.map(x => x.playlist.title ? {title: x.playlist.title, source: x.owner} : null).filter(x => x)
	const set = new Set()
	for (let i = 0; i < playlists.length; i++) {
		set.add(playlists[i].title)
	}

	const result = playlists.filter((x, i) => x.title === [...set][i]).map(x => {
		return (x = {
			title: x.title,
			subtitle: x.source,
			text: {largetype: x.title},
			icon: {path: './List Filter Images/f54766acb7bc462bd0e0bc1a34b9dab62ca0d383.png'},
			arg: x.title
		})
	})
	const items = alfy.inputMatches(result, 'title')
	alfy.output(items)
}

module.exports = {addBookmark, tags, playlist}
