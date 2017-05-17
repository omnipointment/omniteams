var OmniFirebaseConfig = {
	apiKey: 'AIzaSyDzqDG7BigYHeePB5U74VgVWlIRgjEyV3s',
	authDomain: 'omnipointment.firebaseapp.com',
	databaseURL: 'https://omnipointment.firebaseio.com',
	storageBucket: 'project-1919171548079707132.appspot.com',
	noScreenshots: true,
	localhost: false
}
var OmniFirebase = firebase.initializeApp(OmniFirebaseConfig, 'Omni Firebase');
var OmniDB = OmniFirebase.database();

var LabsFirebaseConfig = {
	apiKey: "AIzaSyD1KVVGuoOsINY1l1DrZDKS8T3qN7Rp1LY",
	authDomain: "omnilabs-2dc80.firebaseapp.com",
	databaseURL: "https://omnilabs-2dc80.firebaseio.com",
	projectId: "omnilabs-2dc80",
	storageBucket: "omnilabs-2dc80.appspot.com",
	messagingSenderId: "593871858219"
}
var LabsFirebase = firebase.initializeApp(LabsFirebaseConfig, 'Labs Firebase');
var LabsDB = LabsFirebase.database();

function FormatTeam(val, tid){
	val.tid = tid;
	if(!val.pins){
		val.pins = {};
	}
	if(!val.meetings){
		val.meetings = {};
	}
	if(!val.ignoremids){
		val.ignoremids = {};
	}
	return val;
}

function getTeam(tid){
	return new Promise((resolve, reject) => {
		if(tid){
			var ref = LabsDB.ref('omniteams/teams/' + tid);
			ref.once('value', snap => {
				var val = snap.val();
				if(!snap.exists()){
					reject('No team exists with this ID.');
				}
				val = FormatTeam(val, tid);
				resolve(val);
			}).catch(reject);
		}
		else{
			reject('No team id given.');
		}
	});	
}

function renderUserDiv(holder, user){
	holder.innerHTML = '';
	let div = document.createElement('div');
		div.classList.add('member');
	let pic = document.createElement('div');
		pic.style.background = 'url("' + user.picture + '")'
	let name = document.createElement('div');
		name.innerText = user.name;
		div.appendChild(pic);
		div.appendChild(name);
	holder.appendChild(div);
}

function getUser(uid){
	return new Promise((resolve, reject) => {
		if(uid){
			var ref = OmniDB.ref('prometheus/users/' + uid + '/profile');
			ref.once('value', snap => {
				var val = snap.val();
				resolve(val);
			}).catch(reject);
		}
		else{
			reject('No user id given.');
		}
	});
}

function getTeamWithUsers(tid){
	return new Promise((resolve, reject) => {
		getTeam(tid).then(team => {
			let promises = [];
			for(let uid in team.members){
				let p = getUser(uid);
					p.uid = uid;
				promises.push(p);
			}
			team.users = {};
			Promise.all(promises).then(users => {
				users.forEach((user, idx) => {
					let userid = promises[idx].uid;
					user.userid = userid;
					team.users[userid] = user;
				});
				resolve(team);
			});
		}).catch(reject);
	});
}

function saveRatings(ratings){
	return new Promise((resolve, reject) => {
		let promises = [];
		let ratingsRef = LabsDB.ref('omniteams/ratings/' + TEAM_ID);
		ratings.forEach(rating => {
			let pr = ratingsRef.push(rating);
			promises.push(pr);
		});
		Promise.all(promises).then(() => {
			resolve(true);
		}).catch(reject);
	});
}

function getRatingsList(tid, inRange){
	let range = inRange || {from: 0, to: Infinity};
	return new Promise((resolve, reject) => {
		let promises = [];
		let ratingsRef = LabsDB.ref('omniteams/ratings/' + TEAM_ID);
		ratingsRef.once('value', snap => {
			let val = snap.val();
			let list = Object.keys(val).map(rid => {
				return val[rid];
			}).filter(rate => {
				return rate.timestamp < range.to && rate.timestamp > range.from;
			});
			resolve(list);
		}).catch(reject);
	});
}

function displayError(msg){
	/*vex.dialog.alert({
		message: msg
	});*/
	console.error(msg);
}

function getQueryParams(qs) {
	qs = qs.split('+').join(' ');
	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
}

function initCategoryMap(callback){
	let res = {};
	CATEGORY_LIST.forEach(category => {
		if(category.type === 'behavior'){
			if(callback){
				res[category.id] = callback(category);
			}
			else{
				res[category.id] = {};
			}
		}
	});
	return res;
}

function initCategoryList(){
	return CATEGORY_LIST.filter(category => {
		return category.type === 'behavior';
	}).map(category => {
		return category.id;
	});
}

function selectFromList(list, params){
	return list.filter(item => {
		let include = true;
		for(let tag in params){
			if(item[tag] !== params[tag]){
				include = false;
			}
		}
		return include;
	});
}

function averageList(list){
	let sum = 0;
	list.forEach(item => {
		sum += item;
	});
	let avg = sum / list.length;
	return avg;
}

function getWrappedIndex(list, index){
	var idx = index % list.length;
	return idx;
}

function shuffleWithSeed(list, seed){
	var seed = seed.toLowerCase();
	var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
	var newList = [];
	while(list.length > 0){
		var sidx = getWrappedIndex(seed, newList.length);
		var letter = seed[sidx];
		var aidx = getWrappedIndex(list, alphabet.indexOf(letter));
		var nextItem = list.splice(aidx, 1)[0];
		newList.push(nextItem);
	}
	return newList;
}

/* Specific Code */

function toPercentString(value, max){
	return ((value / max) * 100) + '%';
}

function renderCategoryRatings(category, values, max){
	//let html = '<div class="category col col--onethird">'
	let html = '<div class="category-ratings">'
			html += '<div class="category-bar bar-self" style="height:' + toPercentString(values.self, max) + ';"><div class="bar-value">' + values.self.toFixed(2) + '</div></div>'
			html += '<div class="category-bar bar-peer" style="height:' + toPercentString(values.peer, max) + ';"><div class="bar-value">' + values.peer.toFixed(2) + '</div></div>'
			html += '<div class="category-bar bar-team" style="height:' + toPercentString(values.team, max) + ';"><div class="bar-value">' + values.team.toFixed(2) + '</div></div>'
			html += '<div class="bar-hidden"></div>'
		html += '</div>'
		html += '<div class="category-label">' + category.name + '</div>'
	//html += '</div>'
	let div = document.createElement('div');
		div.classList.add('category', 'col', 'col--onethird-sm');
		div.innerHTML = html;
	return div;
}

function renderComment(comment){
	let div = document.createElement('div');
		//div.classList.add('comment', 'col', 'col--onehalf-sm');
	let msg = document.createElement('div');
		msg.classList.add('comment-message');
		msg.innerText = comment;
		div.appendChild(msg);
	return div;
}

function renderSelfComment(comment){
	let div = renderComment(comment);
	let child = div.children[0];
	let span = document.createElement('span');
		span.innerText = 'Self Comment';
	let text = child.childNodes[0];
		child.innerHTML = "";
		child.appendChild(span);
		child.appendChild(text);
	return div;
}

function normalizeRatings(ratings, range){
	return ratings.map(rate => {
		if(rate.level){
			let level = parseFloat(rate.level);
			let per = (level - range.old[0]) / (range.old[1] - range.old[0]);
			let normalized = (per * (range.new[1] - range.new[0])) + range.new[0];
			rate.level = normalized;
		}
		return rate;
	});
}

/* Main Routine */

//let USER_ID = '568eb4e705d347a26a94ecc4';
//let TEAM_ID = '-Kj9u7wuTAvJhwzfGHg2';

let params = getQueryParams(document.location.search);
let USER_ID = params.uid || '57a2436ba678614943ef5fd3';
let TEAM_ID = params.team || '-KkH6b_A054B7SSstMEA';

let prometheus = Prometheus(OmniFirebaseConfig);
	prometheus.logon(USER_ID);
	prometheus.save({
		type: 'OPEN_RATINGS',
		tid: TEAM_ID
	});

let initReport = (uid) => {

	//USER_ID = uid;

	//mainRatings({users: FAKE_TEAM}).then(finishRatings).catch(displayError);

	getTeamWithUsers(TEAM_ID).then(team => {

		getRatingsList(TEAM_ID).then(ratings => {

			mainReport(ratings, team).then(finishReport).catch(displayError);

		}).catch(displayError);

	}).catch(displayError);

}

/*
 * ASSUMPTIONS
 * Only one set of ratings has been provided from each member
 */
let mainReport = (inRatings, team) => {
	return new Promise((resolve, reject) => {

		let ratings = normalizeRatings(inRatings, {
			old: [1, 5],
			new: [0, 10]
		});

		const MAX_RATING = 10;

		let studentSection = document.getElementById('section-student');
		let ratingsSection = document.getElementById('section-ratings');
		let feedbackSection = document.getElementById('section-feedback');
		let improvementSection = document.getElementById('section-improvement');

		let teamAverages = initCategoryMap(category => {
			let list = selectFromList(ratings, {
				category: category.id
			}).map(rate => parseFloat(rate.level));
			let avg = averageList(list);
			return avg;
		});

		let selfRatings = initCategoryMap(category => {
			let rate = selectFromList(ratings, {
				category: category.id,
				from: USER_ID,
				to: USER_ID
			})[0];
			let level = parseFloat(rate.level);
			return level;
		});

		let peerRatings = initCategoryMap(category => {
			let list = selectFromList(ratings, {
				category: category.id,
				to: USER_ID
			}).filter(rate => {
				return rate.from !== USER_ID;
			}).map(rate => parseFloat(rate.level));
			let avg = averageList(list);
			return avg;
		});

		renderUserDiv(studentSection, team.users[USER_ID]);

		CATEGORY_LIST.filter(category => category.type === 'behavior').forEach(category => {
			let div = renderCategoryRatings(category, {
				self: selfRatings[category.id],
				peer: peerRatings[category.id],
				team: teamAverages[category.id]
			}, MAX_RATING);
			ratingsSection.appendChild(div);
		});

		let selfComment = selectFromList(ratings, {
			category: 'comment',
			to: USER_ID,
			from: USER_ID
		})[0];
		let comments = selectFromList(ratings, {
			category: 'comment',
			to: USER_ID
		}).filter(rate => rate.from !== USER_ID).map(rate => rate.comment);
		let selfCommentDiv = renderSelfComment(selfComment.comment);
			feedbackSection.appendChild(selfCommentDiv);
		let shuffled = shuffleWithSeed(comments, 'omnipointment');
		shuffled.forEach(comment => {
			let div = renderComment(comment);
			feedbackSection.appendChild(div);
		});

		let improvementMap = initCategoryMap(category => {
			let squaresSum = 0;
			for(let uid in team.users){
				let theyYou = selectFromList(ratings, {
					category: category.id,
					from: uid,
					to: USER_ID
				})[0];
				let theySelf = selectFromList(ratings, {
					category: category.id,
					from: uid,
					to: uid
				})[0];
				let diff = parseFloat(theyYou.level) - parseFloat(theySelf.level);
				squaresSum += (diff * Math.abs(diff))
			}
			return squaresSum;
		});

		let minCategory = false;
		let minValue = Infinity;
		for(let cid in improvementMap){
			let improveVal = improvementMap[cid];
			if(improveVal < minValue){
				minCategory = cid;
				minValue = improveVal;
			}
		}

		let improveCategory = selectFromList(CATEGORY_LIST, {
			id: minCategory
		})[0];

		let actions = improveCategory.levels.exceeds;
		actions.forEach(action => {
			let p = document.createElement('p');
				p.innerText = action;
			improvementSection.appendChild(p);
		});



		console.log(improvementMap)


		console.log(team);
		console.log(ratings);

		resolve(true);
	});
}

let finishReport = (done) => {



}

var authConfig = {
	localStorageTag: 'prometheus_user_omnipointment',
	loginRedirectURL: 'https://www.omnipointment.com/login',
	xdSourceURL: 'https://www.omnipointment.com/nothingtoseehere.html'
}

wineGlassAuth(authConfig).then(initReport).catch(err => {
	if(err.type === 'POPUP_BLOCKED'){
		displayError(err.message);
	}
	else{
		displayError(err);
	}
});