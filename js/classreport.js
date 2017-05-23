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

const MISSING_PICTURE = 'http://vingkan.github.io/omnipointment/img/empty-user-img.png';

function renderUserDiv(inUser, opt){
	let options = opt || {};
	let user = inUser;
	if(!inUser){
		return false;
	}
	else if(inUser.profile){
		user = inUser.profile;
	}
	let div = document.createElement('div');
		div.classList.add('member')
	let img = document.createElement('div');
		img.classList.add('user-image')
		img.style.background = 'url("' + user.picture || false + '")';
	if(options.pictureOnly){
		return img;
	}
	let name = document.createElement('div');
		name.innerText = user.name;
	div.appendChild(img);
	div.appendChild(name);
	if(options.callback){
		div.addEventListener('click', e => {
			options.callback(user);
		});
	}
	return div;
}

/*function renderUserDiv(holder, user){
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
}*/

function getUser(uid){
	return new Promise((resolve, reject) => {
		if(uid){
			var ref = OmniDB.ref('prometheus/users/' + uid + '/profile');
			ref.once('value', snap => {
				var val = snap.val();
				if(!val.picture){
					val.picture = MISSING_PICTURE;
				}
				resolve(val);
			}).catch(reject);
		}
		else{
			reject('No user id given.');
		}
	});
}

function getTeamWithUsers(tid, inTeam){
	return new Promise((resolve, reject) => {
		let internalCallback = (team) => {
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
		};
		if(inTeam){
			internalCallback(inTeam);
		}
		else{
			getTeam(tid).then(internalCallback).catch(reject);
		}
	});
}

function getRatingsList(tid, inRange){
	let range = inRange || {from: 0, to: Infinity};
	return new Promise((resolve, reject) => {
		let promises = [];
		let ratingsRef = LabsDB.ref('omniteams/ratings/' + tid);
		ratingsRef.once('value', snap => {
			let val = snap.val() || {};
			let list = Object.keys(val).map(rid => {
				return val[rid];
			}).filter(rate => {
				return rate.timestamp < range.to && rate.timestamp > range.from;
			}).map(rate => {
				if(rate.level){
					rate.level = parseFloat(rate.level);
				}
				return rate;
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

let renderSWDiv = (team, model, opt) => {
	let options = opt || {};
	let strength = selectFromList(CATEGORY_LIST, {
		id: model.strongest
	})[0].name;
	let weakness = selectFromList(CATEGORY_LIST, {
		id: model.weakest
	})[0].name;
	let div = document.createElement('div');
		div.classList.add('row', 'row--condensed');
	let html = '<div class="team-sw-holder strength col col--onehalf-sm">'
			html +=	'<div>Strongest Cateogry</div>'
			html +=	'<div>' + strength + '</div>'
		html += '</div>'
		html += '<div class="team-sw-holder weakness col col--onehalf-sm">'
			html +=	'<div>Weakest Category</div>'
			html +=	'<div>' + weakness + '</div>'
		html += '</div>'
	div.innerHTML = html;
	return div;
}

let renderUserContributionDiv = (user, opt) => {
	let options = opt || {};
	let div = document.createElement('div');
		div.classList.add('member-holder');
	let contrib = document.createElement('div');
		contrib.classList.add('member-contribution');
		if(!options.contribution){
			contrib.innerText = '?';
		}
		else{
			contrib.innerText = options.contribution;
		}
		if(options.style){
			for(let sid in options.style){
				contrib.style[sid] = options.style[sid];
			}
		}
	let userDiv = renderUserDiv(user, options);
	div.appendChild(contrib);
	div.appendChild(userDiv);
	return div;
}

let renderTeamReportButton = (team, model, opt) => {
	let btn = document.createElement('button');
		btn.classList.add('btn', 'btn--ghost', 'btn--center');
		btn.innerText = 'View Team Report';
		btn.addEventListener('click', e => {
			let trURL = window.location.origin + '/teamreport.html' + '?team=' + team.tid;
			prometheus.save({
				type: 'TEAM_REPORT_FROM_CLASS_REPORT',
				tid: team.tid,
				course: params.course
			});
			window.open(trURL);
		});
	return btn;
}

let renderTeamDiv = (team, model, opt) => {
	let options = opt || {};
	let div = document.createElement('div');
		div.classList.add('team');
		if(options.classList){
			options.classList.forEach(className => {
				div.classList.add(className);
			});
		}
	let overview = document.createElement('div');
		overview.classList.add('team-overview');
		let h = document.createElement('h3');
			h.innerText = team.name;
			overview.appendChild(h);
	/*let swDiv = renderSWDiv(team, model, options);
		swDiv.classList.add('team-sw');*/
	let members = document.createElement('div');
		members.classList.add('team-members');
		let userOption = {};
		if(options.userCallback){
			userOption.callback = (user) => {
				options.userCallback(user, team);
			}
		}
		let ratingsFrom = {};
		model.ratings.forEach(rate => {
			ratingsFrom[rate.from] = true;
		});
		let totalRatingsFrom = Object.keys(ratingsFrom).length;
		let max = MAX_RATING * totalRatingsFrom;
		let p1 = document.createElement('p');
			p1.innerText = totalRatingsFrom + '/' + Object.keys(team.users).length + ' students submitted ratings.'
		members.appendChild(p1);
		Object.keys(team.users).map(uid => {
			let user = team.users[uid];
			user.contribution = false;
			let sum = 0;
			let toRatings = selectFromList(model.ratings, {
				category: 'contibuting',
				to: uid
			});
			if(toRatings.length > 0){
				toRatings.forEach(rate => {
					sum += rate.level;
				});
				user.contribution = sum;
			}
			return user;
		}).sort((a, b) => {
			return b.contribution - a.contribution;
		}).forEach(user => {
			if(user.contribution || user.contribution === 0){
				let percentile = (user.contribution / max) * 10;
				userOption.contribution = percentile.toFixed(1);
			}
			else{
				userOption.contribution = user.contribution;
			}
			let userDiv = renderUserContributionDiv(user, userOption);
			members.appendChild(userDiv);
		});
	let rBtn = renderTeamReportButton(team, model, opt);
	div.appendChild(overview);
	div.appendChild(members);
	div.appendChild(rBtn);
	//div.appendChild(swDiv);
	return div;
}

/* Main Routine */

//let USER_ID = '568eb4e705d347a26a94ecc4';
//let TEAM_ID = '-Kj9u7wuTAvJhwzfGHg2';

let params = getQueryParams(document.location.search);

let prometheus = Prometheus(OmniFirebaseConfig);
	//prometheus.logon(USER_ID);

let tidList = ['-KkH6b_A054B7SSstMEA'];

let initReport = (uid) => {

	prometheus.logon(uid);
	prometheus.save({
		type: 'VIEW_CLASS_REPORT',
		course: params.course
	});

	//USER_ID = uid;

	if(params.course){

		let courseID = params.course.toLowerCase();
		let cRef = LabsDB.ref('omniteams/courses/' + courseID);
		cRef.once('value', snap => {
			let courseData = snap.val();
			if((uid in courseData.instructors) || courseData.public){
				console.log('Approved for access.');
			}
			else{
				window.location = window.location.origin + '/team.html';
			}
		});

		let ref = LabsDB.ref('omniteams/teams');
		let query = ref.orderByChild('course').startAt(params.course).endAt(params.course);
		query.once('value', nodes => {
			let nodeMap = nodes.val() || {};
			let teamList = Object.keys(nodeMap).map(nid => {
				let team = FormatTeam(nodeMap[nid], nid);
				return {
					tid: nid,
					team: team
				}
			});
			let teamPromises = [];
			teamList.forEach(teamEntry => {
				let p = new Promise((resolve, reject) => {
					let tid = teamEntry.tid;
					getTeamWithUsers(tid, teamEntry.team).then(team => {
						getRatingsList(tid).then(ratings => {
							resolve({
								tid: tid,
								team: team,
								ratings: ratings
							})
						}).catch(reject);
					}).catch(reject);
				});
				teamPromises.push(p);
			});
			Promise.all(teamPromises).then(teamData => {
				mainReport(teamData).then(finishReport).catch(displayError);
			}).catch(displayError);
		});
	}
	else{
		let teamPromises = [];
		tidList.forEach(tid => {
			let p = new Promise((resolve, reject) => {
				getTeamWithUsers(tid).then(team => {
					getRatingsList(tid).then(ratings => {
						resolve({
							tid: tid,
							team: team,
							ratings: ratings
						})
					}).catch(reject);
				}).catch(reject);
			});
			teamPromises.push(p);
		});
		Promise.all(teamPromises).then(teamData => {
			mainReport(teamData).then(finishReport).catch(displayError);
		}).catch(displayError);
	}

}

const MAX_RATING = 10;

/*
 * ASSUMPTIONS
 * Only one set of ratings has been provided from each member
 */
let mainReport = (teamData) => {
	return new Promise((resolve, reject) => {

		teamData = teamData.map(data => {
			data.ratings = normalizeRatings(data.ratings, {
				old: [1, 5],
				new: [0, MAX_RATING]
			});
			return data;
		});

		console.log(teamData)

		let teamsSection = document.getElementById('section-teams');

		teamData.map(data => {
			data.order = 0;
			let sum = 0;
			let cr = selectFromList(data.ratings, {
				category: 'contibuting'
			});
			if(cr.length === 0){
				data.order = Infinity;
			}
			else{
				cr.forEach(rate => {
					sum += rate.level;
				});
				data.order = sum;
			}
			return data;
		}).sort((a, b) => {
			return a.order - b.order;
		}).forEach(data => {
			let model = getTeamModel(data);
			let div = renderTeamDiv(data.team, model, {
				classList: ['col', 'col--onethird-sm'],
				userCallback: (user, team) => {
					console.log(user, team)
					let uid = user.userid;
					let tid = team.tid;
					if(uid && tid){
						let srURL = window.location.origin + '/studentreport.html' + '?uid=' + uid + '&team=' + tid;
						prometheus.save({
							type: 'STUDENT_REPORT_FROM_CLASS_REPORT',
							tid: tid,
							uid: uid,
							course: params.course
						});
						window.open(srURL);
					}
				}
			});
			teamsSection.appendChild(div);
		});

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