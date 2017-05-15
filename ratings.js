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

function displayError(msg){
	vex.dialog.alert({
		message: msg
	});
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

function renderTeammateRatingScreen(user, category){
	renderUserDiv(currentTeammateDiv, user);
	for(let i = 0; i < teammateNameDivs.length; i++){
		let div = teammateNameDivs[i].innerText = user.name;
	}
	for(let i = 0; i < categoryDivs.length; i++){
		let div = categoryDivs[i].innerText = category.name;
	}
}

function renderCategory(category, user){
	if(category.type === 'comment'){
		behaviorView.style.display = 'none';
		commentView.style.display = 'block';
	}
	else{
		for(let bKey in category.levels){
			let cell = document.getElementById('cell-' + bKey);
			cell.innerHTML = '';
			let ul = document.createElement('ul');
			let behaviors = category.levels[bKey];
			behaviors.forEach(behavior => {
				let li = document.createElement('li');
				li.innerText = behavior;
				ul.appendChild(li);
			});
			cell.appendChild(ul);
		}
		commentView.style.display = 'none';
		behaviorView.style.display = 'block';
	}
	let questionStr = category.question.replace('%NAME%', user.name);
	questionDiv.innerText = questionStr;
}

function mainRatings(team){
	return new Promise((resolve, reject) => {

		let categoryList = CATEGORY_LIST;

		let userList = Object.keys(team.users).map(uid => {
			return team.users[uid];
		}).sort((a, b) => {
			return a.name.localeCompare(b.name);
		});

		let uidx = 0;
		let cidx = 0;
		let currentUser = false;
		let currentCategory = false;
		let ratings = [];

		let initNextUser = () => {
			let user = userList[uidx];
			if(!user){
				initNextCategory();
			}
			else{
				currentUser = user;
				renderCategory(currentCategory, currentUser);
				renderTeammateRatingScreen(currentUser, currentCategory);
				renderCategoryProgress();
				renderRatingsProgress();
				uidx++;
			}
		}

		let initNextCategory = (overrideUidx) => {
			let category = categoryList[cidx];
			if(!category){
				ratingsFinished();
			}
			else{
				console.log('next category')
				currentCategory = category;
				// Old renderCategory call
				cidx++;
				if(overrideUidx){
					uidx = overrideUidx;
				}
				else{
					uidx = 0;
				}
				initNextUser();
				previewCategory();
			}
		}

		let handleLevelClick = (level) => {
			console.log(currentCategory.name, 'rating for ', currentUser.name);
			ratings.push({
				tid: TEAM_ID,
				from: USER_ID,
				to: currentUser.userid,
				category: currentCategory.id,
				level: level,
				timestamp: Date.now()
			});
			initNextUser();
		}

		let handleCommentSubmit = (comment) => {
			console.log(currentCategory.name, 'rating for ', currentUser.name);
			ratings.push({
				tid: TEAM_ID,
				from: USER_ID,
				to: currentUser.userid,
				category: currentCategory.id,
				comment: comment,
				timestamp: Date.now()
			});
			initNextUser();
		}

		let renderCategoryProgress = () => {
			let progressStr = (uidx + 1) + ' out of ' + userList.length;
			for(let i = 0; i < categoryProgressDivs.length; i++){
				let div = categoryProgressDivs[i].innerText = progressStr;
			}
		}

		let renderRatingsProgress = () => {
			let total = userList.length * categoryList.length;
			let percent = ratings.length / total;
			let totalWidth = 250;
			let scaledWidth = totalWidth * percent;
			progressSlider.style.width = scaledWidth + 'px';
			let progressStr = Math.floor(percent * 100) + '%';
			for(let i = 0; i < progressDivs.length; i++){
				let div = progressDivs[i].innerText = progressStr;
			}
		}

		let previewCategory = () => {
			ratingsView.style.display = 'none';
			categoryView.style.display = 'block';
		}

		let startCategory = () => {
			categoryView.style.display = 'none';
			ratingsView.style.display = 'block';
		}

		let ratingsFinished = () => {
			console.log('Yay you did it.');
			renderRatingsProgress();
			resolve(ratings);
		}

		let categoryBtn = document.getElementById('category-ready');
		categoryBtn.addEventListener('click', e => {
			startCategory();
		});

		let levelButtons = document.getElementsByClassName('level-button');
		for(let i = 0; i < levelButtons.length; i++){
			let btn = levelButtons[i];
			btn.addEventListener('click', e => {
				let level = e.target.dataset.level;
				console.log(level);
				handleLevelClick(level);
			});
		}

		let commentArea = document.getElementById('write-comment');
		let commentBtn = document.getElementById('submit-comment');
		commentBtn.addEventListener('click', e => {
			let comment = commentArea.value;
			console.log(comment);
			handleCommentSubmit(comment);
			commentArea.value = '';
		});

		let removeRating = () => {
			let popped = ratings.pop();
			if(popped.comment){
				console.log('Popped: ', popped);
				commentArea.value = popped.comment;
			}
		}

		let prevBtn = document.getElementById('previous-teammate');
		prevBtn.addEventListener('click', e => {
			let oldUidx = uidx;
			uidx -= 2;
			if(uidx < 0){
				console.log('go back a category')
				let oldCidx = cidx;
				cidx -= 2;
				if(cidx < 0){
					cidx = oldCidx;
					uidx = oldUidx;
					throw Error('Cannot go back on first person.');
				}
				else{
					let overrideUidx = userList.length - 1;
					removeRating();
					initNextCategory(overrideUidx);
				}
			}
			else{
				removeRating();
				initNextUser();
			}
		});

		initNextCategory();

	});
}

let FAKE_TEAM = {
	h: {
		name: 'Haosheng Li',
		picture: 'https://lh5.googleusercontent.com/-5PPixOlWGO0/AAAAAAAAAAI/AAAAAAAAAX8/SW_gUeqerbs/photo.jpg?sz=200'
	},
	y: {
		name: 'Yuan Huang',
		picture: 'https://lh3.googleusercontent.com/-uHmMYkjsBH8/AAAAAAAAAAI/AAAAAAAAAAA/1XTzVtpueWc/photo.jpg?sz=200'
	},
	l: {
		name: 'Le Liu',
		picture: 'https://avatars1.githubusercontent.com/u/25411457?v=3'
	},
	v: {
		name: 'Vinesh Kannan',
		picture: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p160x160/16105758_1054398484705990_6386797828324798282_n.jpg?oh=647334bf8d7d00b46b84eec1df0f3c0e&oe=597916DE'
	}
};

//let USER_ID = '568eb4e705d347a26a94ecc4';
//let TEAM_ID = '-Kj9u7wuTAvJhwzfGHg2';

let params = getQueryParams(document.location.search);
let USER_ID = params.uid;
let TEAM_ID = params.team;

let ratingsView = document.getElementById('ratings-view');
let doneView = document.getElementById('done-view');
let categoryView = document.getElementById('category-view');
let behaviorView = document.getElementById('behavior-view');
let commentView = document.getElementById('comment-view');

let currentTeammateDiv = document.getElementById('current-teammate');
let teammateNameDivs = document.getElementsByClassName('rating-name');
let categoryDivs = document.getElementsByClassName('rating-category');
let categoryProgressDivs = document.getElementsByClassName('rating-category-progress');
let progressDivs = document.getElementsByClassName('rating-progress');
let submissionDiv = document.getElementById('rating-submission');
let questionDiv = document.getElementById('rating-question');

let progressWrapper = document.getElementById('progress-wrapper');
let progressSlider = document.getElementById('progress-slider');

let prometheus = Prometheus(OmniFirebaseConfig);
	prometheus.logon(USER_ID);
	prometheus.save({
		type: 'OPEN_RATINGS',
		tid: TEAM_ID
	});

let initRatings = (uid) => {

	USER_ID = uid;

	//mainRatings({users: FAKE_TEAM}).then(finishRatings).catch(displayError);

	getTeamWithUsers(TEAM_ID).then(team => {

		mainRatings(team).then(finishRatings).catch(displayError);

	}).catch(displayError);

}

let finishRatings = (ratings) => {

	ratingsView.style.display = 'none';
	doneView.style.display = 'block';

	console.log(ratings);

	saveRatings(ratings).then(() => {
		submissionDiv.innerText = 'Your peer evaluations have been submitted!';
	}).catch(displayError);

	prometheus.save({
		type: 'FINISH_RATINGS',
		tid: TEAM_ID
	});

}

var authConfig = {
	localStorageTag: 'prometheus_user_omnipointment',
	loginRedirectURL: 'https://www.omnipointment.com/login',
	xdSourceURL: 'https://www.omnipointment.com/nothingtoseehere.html'
}

wineGlassAuth(authConfig).then(initRatings).catch(err => {
	if(err.type === 'POPUP_BLOCKED'){
		displayError(err.message);
	}
	else{
		displayError(err);
	}
});