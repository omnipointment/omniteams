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

function renderUserDiv(holder, user){
	holder.innerHTML = '';
	let div = document.createElement('div');
		div.classList.add('member');
	let pic = document.createElement('div');
		pic.style.background = 'url("' + user.picture || false + '")'
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

let toPercentString = (value, max) => {
	return ((value / max) * 100) + '%';
}

let getRatingStyle = (value, max) => {
	let res = {
		value: false,
		height: false
	}
	if(value < 0){
		res.value = '?'
		res.height = '0%';
	}
	else{
		res.value = value.toFixed(2);
		res.height = toPercentString(value, max);
	}
	return res;
}

function renderCategoryRatings(category, values, max){
	//let html = '<div class="category col col--onethird">'
	let s = getRatingStyle(values.self, max);
	let p = getRatingStyle(values.peer, max);
	let t = getRatingStyle(values.team, max);
	let html = '<div class="category-ratings">'
			html += '<div class="category-bar bar-self" style="height:' + s.height + ';"><div class="bar-value">' + s.value + '</div></div>'
			html += '<div class="category-bar bar-peer" style="height:' + p.height + ';"><div class="bar-value">' + p.value + '</div></div>'
			html += '<div class="category-bar bar-team" style="height:' + t.height + ';"><div class="bar-value">' + t.value + '</div></div>'
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
		msg.innerText = comment || '';
		div.appendChild(msg);
	return div;
}

function renderSelfComment(comment){
	let div = renderComment(comment);
	let child = div.children[0];
	let span = document.createElement('span');
		span.innerText = 'Self Comment';
	let text = child.childNodes[0];
	if(text){
		child.innerHTML = "";
		child.appendChild(span);
		child.appendChild(text);
	}
	return div;
}

/* Main Routine */

//let USER_ID = '568eb4e705d347a26a94ecc4';
//let TEAM_ID = '-Kj9u7wuTAvJhwzfGHg2';

let params = getQueryParams(document.location.search);
let USER_ID = params.uid || '57a2436ba678614943ef5fd3';
let TEAM_ID = params.team || '-KkH6b_A054B7SSstMEA';

let prometheus = Prometheus(OmniFirebaseConfig);

let initReport = (uid) => {

	prometheus.logon(uid);

	if(params.code){
		prometheus.save({
			type: 'VIEW_STUDENT_REPORT_FROM_CLASS_CODE',
			class: params.code
		});

		let courseRef = LabsDB.ref('omniteams/teams');
		let courseQuery = courseRef.orderByChild('course').equalTo(params.code);
		courseQuery.once('value', snap => {
			let nodes = snap.val() || {};
			let yourTeam = false;
			if(Object.keys(nodes).length > 0){
				for(let tid in nodes){
					let courseTeam = nodes[tid];
					if(courseTeam.members){
						if(uid in courseTeam.members){
							yourTeam = tid;
							break;
						}
					}
				}
				if(yourTeam){
					let srURL = window.location.origin + '/studentreport.html' + '?uid=' + uid + '&team=' + yourTeam;
					window.location = srURL;
				}
				else{
					prometheus.save({
						type: 'STUDENT_REPORT_STUDENT_NOT_FOUND',
						class: params.code
					});
					vex.dialog.alert('Sorry, we could not find a student collaboration report for you in this class. Make sure your code is spelled correctly (case-sensitive) or email team@omnipointment.com for help.');
				}
			}
			else{
				prometheus.save({
					type: 'STUDENT_REPORT_CLASS_NOT_FOUND',
					class: params.code
				});
				vex.dialog.alert('Sorry, we could not find any teams for the class code: ' + params.code + '. Make sure your code is spelled correctly (case-sensitive) or email team@omnipointment.com for help.');
			}
		});

	}
	else{
		prometheus.save({
			type: 'VIEW_STUDENT_REPORT',
			tid: TEAM_ID,
			uid: USER_ID
		});

		//USER_ID = uid;

		//mainRatings({users: FAKE_TEAM}).then(finishRatings).catch(displayError);

		getTeamWithUsers(TEAM_ID).then(team => {

			getRatingsList(TEAM_ID).then(ratings => {

				mainReport(ratings, team).then(finishReport).catch(displayError);

			}).catch(displayError);

		}).catch(displayError);
	}

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

		let submittedYourRatings = (ratings.filter(rate => rate.from === USER_ID).length > 0);
		if(!submittedYourRatings){
			vex.dialog.alert({
				message: 'We noticed that you haven\'t finished your peer evaluation yet... Please give your teammates feedback before reading the feedback they left for you!',
				buttons: [
					$.extend({}, vex.dialog.buttons.YES, {text: 'Give Feedback'}),
					$.extend({}, vex.dialog.buttons.NO, {text: 'Be Selfish'})
				],
				callback: (press) => {
					if(press){
						prometheus.save({
							type: 'EVAL_FROM_STUDENT_REPORT',
							tid: TEAM_ID,
							uid: USER_ID
						});
						let peURL = window.location.origin + '/ratings.html' + '?team=' + TEAM_ID;
						window.location = peURL;
					}
					else{
						prometheus.save({
							type: 'SELFISH_FROM_STUDENT_REPORT',
							tid: TEAM_ID,
							uid: USER_ID
						});
					}
				}
			});
		}

		const MAX_RATING = 10;

		let studentSection = document.getElementById('section-student');
		let ratingsSection = document.getElementById('section-ratings');
		let feedbackSection = document.getElementById('section-feedback');
		let improvementSection = document.getElementById('section-improvement');

		let teamAverages = false;
		let selfRatings = false;
		let peerRatings = false;
		
		teamAverages = initCategoryMap(category => {
			let list = selectFromList(ratings, {
				category: category.id
			}).map(rate => rate.level);
			let avg = -1;
			if(list.length > 0){
				avg = averageList(list);
			}
			return avg;
		});

		selfRatings = initCategoryMap(category => {
			let rate = selectFromList(ratings, {
				category: category.id,
				from: USER_ID,
				to: USER_ID
			})[0];
			let level = -1;
			if(rate){
				level = rate.level;
			}
			return level;
		});

		peerRatings = initCategoryMap(category => {
			let list = selectFromList(ratings, {
				category: category.id,
				to: USER_ID
			}).filter(rate => {
				return rate.from !== USER_ID;
			}).map(rate => rate.level);
			let avg = -1;
			if(list.length > 0){
				avg = averageList(list);
			}
			return avg;
		});

		let ratingsFrom = {};
		ratings.forEach(rate => {
			ratingsFrom[rate.from] = true;
		});
		let totalRatingsFrom = Object.keys(ratingsFrom).length;
		let max = MAX_RATING * totalRatingsFrom;
		let rsp = document.createElement('p');
			rsp.innerText = totalRatingsFrom + '/' + Object.keys(team.users).length + ' of your teammates submitted ratings.'

		let userDiv = document.createElement('div');
		studentSection.appendChild(userDiv);
		studentSection.appendChild(rsp);
		renderUserDiv(userDiv, team.users[USER_ID]);

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
		}).filter(rate => rate.from !== USER_ID && rate.comment).map(rate => rate.comment);
		if(selfComment){
			let selfCommentDiv = renderSelfComment(selfComment.comment);
				feedbackSection.appendChild(selfCommentDiv);
		}
		if(!selfComment && comments.length === 0){
			let div = renderComment('No comments to show.');
			feedbackSection.appendChild(div);
		}
		else{
			let shuffled = shuffleWithSeed(comments, 'omnipointment');
			shuffled.forEach(comment => {
				let div = renderComment(comment);
				feedbackSection.appendChild(div);
			});
		}

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
				if(theyYou && theySelf){
					let diff = parseFloat(theyYou.level) - parseFloat(theySelf.level);
					squaresSum += (diff * Math.abs(diff))
				}
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
			let p = document.createElement('div');
				p.classList.add('improve-item');
				p.innerText = action;
			improvementSection.appendChild(p);
		});

		console.log('OUTLIER ANALYSIS');

		let confidenceMap = initCategoryMap(category => {
			let data = assessOutlier(ratings, category.id, USER_ID);
			return data;
		});

		console.log(confidenceMap)

		console.log(improvementMap)

		console.log(team);
		console.log(ratings);

		resolve(true);
	});
}

let finishReport = (done) => {

	let careerButton = document.getElementById('submit-career');
	let careerResponse = document.getElementById('respond-career');
	careerButton.addEventListener('click', e => {
		let cRef = LabsDB.ref('omniteams/careers/');
		cRef.push({
			uid: USER_ID,
			response: careerResponse.value,
			timestamp: Date.now()
		}).then(done => {
			vex.dialog.alert('Your response has been submitted, thank you!');
		}).catch(displayError);
		prometheus.save({
			type: 'CAREER_RESPONSE',
			response: careerResponse.value
		});
	});

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