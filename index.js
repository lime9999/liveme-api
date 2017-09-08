'use strict';
/*

	  _     _           __  __           _    ____ ___ 
	 | |   (_)_   _____|  \/  | ___     / \  |  _ \_ _|
	 | |   | \ \ / / _ \ |\/| |/ _ \   / _ \ | |_) | | 
	 | |___| |\ V /  __/ |  | |  __/  / ___ \|  __/| | 
	 |_____|_| \_/ \___|_|  |_|\___| /_/   \_\_|  |___|
	                                                   	

*/

const superagent = require('superagent'), nocache = require('superagent-no-cache')

/* 
	Constants
*/
const LM_GETUSERINFO = 'http://live.ksmobile.net/user/getinfo',
	LM_GETVIDEOINFO = 'http://live.ksmobile.net/live/queryinfo',
	LM_GETREPLAYVIDEOS = 'http://live.ksmobile.net/live/getreplayvideos',
	LM_KEYWORDSEARCH = 'http://live.ksmobile.net/search/searchkeyword',
	LM_GETLIVEUSERS = 'https://live.ksmobile.net/live/newmaininfo';

/*
	Local Functions
*/

function httpGet(url, query) {
	return new Promise((resolve, reject) => {
		superagent.get(url).query(query).use(nocache).end((err, res) => {
			if (err) {
				return reject(err);
			} else {
				return promise(res.body.data);
			}
		});
	});
}

/*
	Exported Functions
*/

module.exports = {
	/*
		uid: number
		Returns: Promise of a User object
	*/
	getUserInfo: function (uid) {
		return new Promise((resolve, reject) => {
			if (typeof uid == 'undefined' || uid == null || uid <= 0) {
				return reject('Invalid user ID');
			}

			return resolve();
		}).then(() => {
			return httpGet(LM_GETUSERINFO, { userid: uid })
		})
			.then(data => {
				return data.user_info; 
			});
	},

	/*
		Synchronous version of `getUserInfo`
		uid: number
		Returns: User object, null on failure
	*/
	getUserInfoSync: async function (uid) {
		return await this.getUserInfo(uid)
			.catch(err => {
				return null;
			});
	},

	/*
		vid: number
		Returns: Promise of a Video object
	*/
	getVideoInfo: function (vid) {
		return new Promise((resolve, reject) => {
			if (typeof vid == 'undefined' || vid == null || vid <= 0) {
				return reject('Invalid video ID');
			}

			return resolve();
		}).then(() => {
			return httpGet(LM_GETVIDEOINFO, { userid: 0, videoid: vid })
		})
		.then(data => {
			return data; 	// Returns video_info & user_info objects for the video
		});
	},

	/*
		Synchronous version of `getVideoInfo`
		vid: number
		Returns: Video object, null on failure
	*/
	getVideoInfoSync: async function (vid) {
		return await this.getVideoInfo(vid)
			.catch(err => {
				return null;
			});
	},

	/*
		uid: number
		page: number (default 1)
		count: number (default 10)
		Returns: Promise of an array of Video objects
	*/
	getUserReplays: function (uid, page, count) {
		return new Promise((resolve, reject) => {
			if (typeof page == 'undefined' || page == null) { page = 1; }
			if (typeof count == 'undefined' || count == null) { count = 10; }

			if (page <= 0) {
				return reject('Page must be greater than 0');
			}

			if (count <= 0) {
				return reject('Count must be greater than 0');
			}

			return resolve();
		}).then(() => {
			return httpGet(LM_GETREPLAYVIDEOS, { userid: uid, page_size: page, page_index: count });
		}).then(data => {
			return data.video_info; 
		});
	},

	/*
		Synchronous version of `getUserReplays`
		uid: number
		page: number (default 1)
		count: number (default 10)
		Returns: An array of Video objects, null on failure
	*/
	getUserReplaysSync: function (uid, page, count) {
		return this.getUserReplays(uid, page, count)
			.catch(err => {
				return null;
			});
	},



	/*
		query: (u)rl for the chat json file

		Returns: An array of message entries
	*/
	getChatHistoryForVideo(u) {

		/* 	actual return is not under variable.data but rather variable and 
		 	must be split into array:
		
		  	OLD CODE:

		  	var messageList = [];
			var split = e.split('\n');

			for (var i = 0; i < split.length; i++) {
				try {
					var lineObj = JSON.parse(split[i]);
					messageList.push(lineObj);
				} catch (er) {
					// just ignore it, sometimes it returns malformed json
				}
			}
		*/

	},



	/*
		query: string
		page: number (default 1)
		count: number (default 10)
		type: number [1|2] (default 1)
		country: string [2 letter country code] (default US)
		Returns: Promise of an array of Video objects
	*/
	performSearch: function (query, page, count, type, country) {
		return new Promise((resolve, reject) => {
			if (typeof page == 'undefined' || page == null) { page = 1; }
			if (typeof count == 'undefined' || count == null) { count = 10; }
			if (typeof type == 'undefined' || type == null) { type = 0; }
			if (typeof country == 'undefined' || country == null) { country = 'US'; }

			if (page <= 0) {
				return reject('Page must be greater than 0');
			}

			if (count <= 0) {
				return reject('Count must be greater than 0');
			}

			if (type < 1 || type > 2) {
				return reject('Type must be 1 or 2');
			}

			// TODO: Maybe check country code? Doubt it's needed.

			return resolve();
		}).then(() => {
			return httpGet(LM_KEYWORDSEARCH, { userid: uid, page_index: page, page_size: count, type: type, countryCode: country });
		}).then(data => {
			if (type == 1) { // list of users
				return data.data_info; 
			} else if (type == 2) { // Video #tag search.
				return data.data_info; 
			}
		});

	},


	/*
		page: number (default 1)
		count: number (default 1)
	*/
	getLive: function (page, count) {
		return new Promise((resolve, reject) => {
			if (typeof page == 'undefined' || page == null) { page = 1; }
			if (typeof count == 'undefined' || count == null) { count = 10; }

			if (page <= 0) {
				return reject('Page must be greater than 0');
			}

			if (count <= 0) {
				return reject('Count must be greater than 0');
			}
			return resolve();
		}).then(() => {
			return httpGet(LM_GETLIVEUSERS, { page_index: page, page_size: count });
		}).then(data => {
			return data.video_info; 
		});



/*

	
	This is the actual OLD command for doing it.  Yes it had an option to filter by level.  I rather pass ALL 
	of the data out and let that filtering (if desired) be done by the other end of the code.


	$.ajax({
		url: 'https://live.ksmobile.net/live/newmaininfo',
		data: {
			page_size: 25,
			page_index: current_page
		},
		cache: false,
		type: 'GET',
		dataType: 'json',
		success: function(r){

			var max = $('#limit').val();
			if (r.data.video_info.length < max) max = r.data.video_info.length;

			for (index = 0; index < max; index++) {
				var entry = r.data.video_info[index];
				
				var level = parseInt(entry.level);
				if ((level > $('#min').val()) && (level < $('#max').val())) {
					count++;
					var h = '<div class="entry '+(entry.sex==0?'female':'male')+'"><img src="'+entry.videocapture+'">';
					h += '<h1>'+(entry.title.length > 0 ? entry.title : '-')+'</h1><h2><span>'+entry.uname+'</span></h2>';
					h += '<h2 class="userid">User ID: <span>'+entry.userid+'</span></h2>';
					h += '<h3>Level: <span>'+entry.level+'</span>Views: <span>'+entry.watchnumber+'</span></h3>';
					h += '<h3>Country: <span>'+entry.countryCode+'</span>Likes: <span>'+entry.likenum+'</span></h3>';
					h += '</div>';
					$('#main').append(h);

				}
			}

			if ((current_page < 100) && (count < $('#limit').val() )) {
				current_page++;
				setTimeout(function(){
					doSearch();
				}, 100);
			}

		}
	});

*/	




	}

};

