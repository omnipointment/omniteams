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
	if(options.classList){
		options.classList.forEach(className => {
			div.classList.add(className);
		});
	}
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

let fillSpans = (className, content) => {
	let spans = document.getElementsByClassName(className);
	for(let s = 0; s < spans.length; s++){
		let span = spans[s];
		span.innerText = content;
	}
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

let renderTeamMembers = (team, model, opt) => {
	let options = opt || {};
	let ignored = options.ignore || {};
	let div = document.createElement('div');
	for(let uid in team.users){
		if(!(uid in ignored)){
			let user = team.users[uid];
			let userDiv = renderUserDiv(user, {
				classList: options.classList || [],
				callback: options.userCallback
			});
			div.appendChild(userDiv);
		}
	}
	return div;
}

let getFirstName = (name) => {
	return name.split(' ')[0];
}

let renderRatingBar = (opt) => {
	let options = opt || {};
	let bar = document.createElement('div');
	let pStr = toPercentString(options.value, options.max);
	let dpStr = ((options.value / options.max) * 10).toFixed(1);
	if(options.max === 0){
		pStr = '0%';
		dpStr = '?';
	}
	let color = options.color;
	let html = '';
	html += '<div class="bar-horizontal">'
		html += '<div class="bar-label">' + options.text + '</div>'
		html += '<div class="bar-holder">'
			html += '<div class="bar-graph" style="width: ' + pStr + '; background: ' + color + ';">'
				html += '<div class="bar-value">' + dpStr + '</div>';
			html += '</div>'
		html += '</div>'
	html += '</div>'
	bar.innerHTML = html;
	return bar;
}

// Light Purple: rgb(79,49,115)
const ORDERED_COLORS = [];
for(let ci = 0; ci < 10; ci++){
	let alpha = (100 - (ci * 15)) / 100;
	let colorStr = 'rgba(79, 49, 115, ' + alpha + ')';
	ORDERED_COLORS.push(colorStr);
}

let renderTeamCategory = (category, team, model, opt) => {
	let options = opt || {};
	let ignored = options.ignore || {};
	let div = document.createElement('div');
	let h = document.createElement('h4');
		h.innerText = category.name;
		div.appendChild(h);
	//let totalMembers = Object.keys(team.members).filter(uid => !(uid in ignored)).length;
	//let maxValue = 10 * totalMembers;
	let bH = document.createElement('div');
		bH.classList.add('rating-graph');
	let ratingsFrom = {};
	model.ratings.forEach(rate => {
		ratingsFrom[rate.from] = true;
	});
	let totalRatingsFrom = Object.keys(ratingsFrom).length;
	let maxValue = 10 * totalRatingsFrom;
	Object.keys(team.members).filter(uid => !(uid in ignored)).map((uid, idx) => {
		return {
			user: team.users[uid],
			score: selectFromList(model.ratings, {
					category: category.id,
					to: uid
				}).reduce((score, rate) => {
					return score + rate.level
				}, 0),
			color: ORDERED_COLORS[idx]
		}
	}).forEach(userData => {
		let user = userData.user;
		let value = userData.score;
		let rBar = renderRatingBar({
			text: getFirstName(user.name),
			value: value,
			max: maxValue,
			color: userData.color
		});
		bH.appendChild(rBar);
	});
	div.appendChild(bH);
	if(options.classList){
		options.classList.forEach(className => {
			div.classList.add(className);
		});
	}
	return div;
}

/* Main Routine */

//let USER_ID = '568eb4e705d347a26a94ecc4';
//let TEAM_ID = '-Kj9u7wuTAvJhwzfGHg2';

let params = getQueryParams(document.location.search);

let prometheus = Prometheus(OmniFirebaseConfig);
	//prometheus.logon(USER_ID);

let initReport = (uid) => {

	prometheus.logon(uid);

	//USER_ID = uid;

	let p = new Promise((resolve, reject) => {
		let tid = params.team;
		getTeamWithUsers(tid).then(team => {
			getRatingsList(tid).then(ratings => {
				let course = team.course || false;
				if(course){
					course = course.toLowerCase();
					let cRef = LabsDB.ref('omniteams/courses/' + course);
					cRef.once('value', snap => {

						let courseData = snap.val() || {};

						if(!(uid in team.members || uid in courseData.instructors)){
							window.location = window.location.origin + '/team.html';
						}
						else{
							console.log('Approved for access.');
						}

						prometheus.save({
							type: 'VIEW_TEAM_REPORT',
							tid: tid
						});

						resolve({
							tid: tid,
							team: team,
							ratings: ratings,
							course: courseData
						});
					});
				}
				else{
					resolve({
						tid: tid,
						team: team,
						ratings: ratings
					});
				}
			}).catch(reject);
		}).catch(reject);
	});
	p.then(teamData => {
		mainReport(teamData).then(finishReport).catch(displayError);
	}).catch(displayError);

}

const MAX_RATING = 10;

/*
 * ASSUMPTIONS
 * Only one set of ratings has been provided from each member
 */
let mainReport = (teamData) => {
	return new Promise((resolve, reject) => {

		console.log(teamData);

		let team = teamData.team;
		let model = getTeamModel(teamData);
		let ratings = normalizeRatings(teamData.ratings, {
			old: [1, 5],
			new: [0, MAX_RATING]
		});
		let course = teamData.course || {};

		let entrySection = document.getElementById('section-entry');
		let overviewSection = document.getElementById('section-overview');
		let membersSection = document.getElementById('section-members');
		let ratingsSection = document.getElementById('section-ratings');
		fillSpans('fill-team-name', team.name);
		fillSpans('fill-course-name', course.name);

		let ratingsFrom = {};
		model.ratings.forEach(rate => {
			ratingsFrom[rate.from] = true;
		});
		let totalRatingsFrom = Object.keys(ratingsFrom).length;
		let rsp = document.createElement('p');
			rsp.innerText = totalRatingsFrom + '/' + Object.keys(team.users).length + ' of the team members submitted ratings.';
		entrySection.appendChild(rsp);

		let swDiv = renderSWDiv(team, model);
		overviewSection.appendChild(swDiv);

		let mDiv = renderTeamMembers(team, model, {
			//ignore: course.instructors,
			userCallback: (user) => {
				console.log(user)
				let uid = user.userid;
				let tid = team.tid;
				if(uid && tid){
					let srURL = window.location.origin + '/studentreport.html' + '?uid=' + uid + '&team=' + tid;
					prometheus.save({
						type: 'STUDENT_REPORT_FROM_TEAM_REPORT',
						tid: tid,
						uid: uid
					});
					window.open(srURL);
				}
			}
		});
		mDiv.classList.add('member-holder');
		membersSection.appendChild(mDiv);

		selectFromList(CATEGORY_LIST, {
			type: 'behavior'
		}).forEach(category => {
			let cDiv = renderTeamCategory(category, team, model, {
				//ignore: course.instructors,
				classList: ['col', 'col--onethird-sm', 'rating-holder']
			});
			ratingsSection.appendChild(cDiv);
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