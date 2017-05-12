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
		});
	});
}

let USER_ID = '568eb4e705d347a26a94ecc4';
let TEAM_ID = '-Kj9u7wuTAvJhwzfGHg2';

getTeamWithUsers(TEAM_ID).then(team => {

	new Promise((resolve, reject) => {

		let categoryList = [
			{
				name: 'Contributing to the Team\'s Work',
				id: 'contibuting',
				bands: {
					exceeds: [],
					meets: [],
					below: []

				}
			},
			{
				name: 'Interacting with Teammates',
				id: 'interacting',
				bands: {
					exceeds: [],
					meets: [],
					below: []

				}
			}

		];

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
				renderTeammateRatingScreen(currentUser, currentCategory);
				uidx++;
			}
		}

		let initNextCategory = () => {
			let category = categoryList[cidx];
			if(!category){
				ratingsFinished();
			}
			else{
				console.log('next category')
				currentCategory = category;
				cidx++;
				uidx = 0;
				initNextUser();
			}
		}

		let handleLevelClick = (level) => {
			console.log(currentCategory.name, 'rating for ', currentUser.name);
			ratings.push({
				from: USER_ID,
				to: currentUser.userid,
				category: currentCategory.id,
				level: level
			});
			initNextUser();
		}

		let ratingsFinished = () => {
			console.log('Yay you did it.');
			resolve(ratings);
		}

		let levelButtons = document.getElementsByClassName('level-button');
		for(let i = 0; i < levelButtons.length; i++){
			let btn = levelButtons[i];
			btn.addEventListener('click', e => {
				let level = e.target.dataset.level;
				console.log(level);
				handleLevelClick(level);
			});
		}

		let prevBtn = document.getElementById('previous-teammate');
		prevBtn.addEventListener('click', e => {
			uidx -= 2;
			if(uidx < 0){
				throw Error('Cannot go back');
			}
			else{
				ratings.pop();
				initNextUser();
			}
		});

		initNextCategory();

	}).then(ratings => {

		let ratingsView = document.getElementById('ratings-view');
		let doneView = document.getElementById('done-view');
		ratingsView.style.display = 'none';
		doneView.style.display = 'block';

		console.log(ratings);

	});

}).catch(console.error);


let currentTeammateDiv = document.getElementById('current-teammate');
let teammateNameDivs = document.getElementsByClassName('rating-name');
let categoryDivs = document.getElementsByClassName('rating-category');


function renderTeammateRatingScreen(user, category){
	renderUserDiv(currentTeammateDiv, user);
	for(let i = 0; i < teammateNameDivs.length; i++){
		let div = teammateNameDivs[i].innerText = user.name;
	}
	for(let i = 0; i < categoryDivs.length; i++){
		let div = categoryDivs[i].innerText = category.name;
	}
}


