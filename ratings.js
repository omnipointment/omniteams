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

const CATEGORY_LIST = [
	{
		name: 'Contributing to the Team\'s Work',
		id: 'contibuting',
		levels: {
			exceeds: [
				'Does more or higher-quality work than expected.',
				'Makes important contributions that improve the team\'s work.',
				'Helps to complete the work of teammates who are having difficulty.'
			],
			meets: [
				'Completes a fair share of the team\'s work with acceptable quality.',
				'Keeps commitments and completes assignments on time.',
				'Fills in for teammates when it is easy or important.'
			],
			below: [
				'Does not do a fair share of the team\'s work.',
				'Delivers sloppy or incomplete work.',
				'Misses deadlines. Is late, unprepared, or absent for team meetings.',
				'Does not assist teammates.',
				'Quits if the work becomes difficult.'
			]

		}
	},
	{
		name: 'Interacting with Teammates',
		id: 'interacting',
		levels: {
			exceeds: [
				'Asks for and shows an interest in teammates\' ideas and contributions.',
				'Improves communication among teammates.',
				'Provides encouragement or enthusiasm to the team.',
				'Asks teammates for feedback and uses their suggestions to improve.'
			],
			meets: [
				'Listens to teammates and respects their contributions.',
				'Communicates clearly.',
				'Shares information with teammates.',
				'Participates fully in team activities.',
				'Respects and responds to feedback from teammates.'
			],
			below: [
				'Interrupts, ignores, bosses, or makes fun of teammates. ',
				'Takes actions that affect teammates without their input.',
				'Does not share information.',
				'Complains, makes excuses, or does not interact with teammates.',
				'Accepts no help or advice.'
			]

		}
	},
	{
		name: 'Keeping the Team on Track',
		id: 'track',
		levels: {
			exceeds: [
				'Watches conditions affecting the team and monitors the team\'s progress.',
				'Makes sure that teammates are making appropriate progress. ',
				'Gives teammates specific, timely, and constructive feedback.'
			],
			meets: [
				'Notices changes that influence the team\'s success. ',
				'Knows what everyone on the team should be doing and notices problems. ',
				'Alerts teammates or suggests solutions when the team\'s success is threatened.'
			],
			below: [
				'Is unaware of whether the team is meeting its goals. ',
				'Does not pay attention to teammates\' progress.',
				'Avoids discussing team problems, even when they are obvious.'
			]
		}
	},
	{
		name: 'Expecting Quality',
		id: 'quality',
		levels: {
			exceeds: [
				'Motivates the team to do excellent work.',
				'Cares that the team does outstanding work, even if there is no additional reward.',
				'Believes that the team can do excellent work.'
			],
			meets: [
				'Encourages the team to do good work that meets all requirements.',
				'Wants the team to perform well enough to earn all available rewards.  ',
				'Believes that the team can fully meet its responsibilities.'
			],
			below: [
				'Satisfied even if the team does not meet assigned standards.',
				'Wants the team to avoid work, even if it hurts the team.',
				'Doubts that the team can meet its requirements.'
			]
		}
	},
	{
		name: 'Having Relevant Knowledge, Skills, and Abilities',
		id: 'ksa',
		levels: {
			exceeds: [
				'Demonstrates the knowledge, skills, and abilities to do excellent work.',
				'Acquires new knowledge or skills to improve the team\'s performance.',
				'Able to perform the role of any team member if necessary.'
			],
			meets: [
				'Has sufficient knowledge, skills, and abilities to contribute to the team\'s work.',
				'Acquires knowledge or skills needed to meet requirements.',
				'Able to perform some of the tasks normally done by other team members.'
			],
			below: [
				'Missing basic qualifications needed to be a member of the team.',
				'Unable or unwilling to develop knowledge or skills to contribute to the team.',
				'Unable to perform any of the duties of other team members.'
			]
		}
	}
];

let USER_ID = '568eb4e705d347a26a94ecc4';
let TEAM_ID = '-Kj9u7wuTAvJhwzfGHg2';

let ratingsView = document.getElementById('ratings-view');
let doneView = document.getElementById('done-view');
let categoryView = document.getElementById('category-view');

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

function renderCategory(category){
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
				renderTeammateRatingScreen(currentUser, currentCategory);
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
				renderCategory(currentCategory);
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
				from: USER_ID,
				to: currentUser.userid,
				category: currentCategory.id,
				level: level
			});
			initNextUser();
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
					throw Error('Cannot go back');
				}
				else{
					let overrideUidx = userList.length - 1;
					ratings.pop();
					initNextCategory(overrideUidx);
				}
			}
			else{
				ratings.pop();
				initNextUser();
			}
		});

		initNextCategory();

	}).then(ratings => {

		ratingsView.style.display = 'none';
		doneView.style.display = 'block';

		console.log(ratings);

	});
}

getTeamWithUsers(TEAM_ID).then(team => {

	//mainRatings(team);

}).catch(console.error);

let FAKE_TEAM = {
	b: {
		name: 'Brendan Batliner',
		picture: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p160x160/18199233_799489983532781_1112290490859067671_n.jpg?oh=f08f0b83e24f55a8ef3f172beb0a707f&oe=597EB153'
	},
	j: {
		name: 'John Valin',
		picture: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c220.126.478.478/s160x160/13091883_1014792971948311_4301784020419923916_n.jpg?oh=0bdf9b98dd93ece4ff72933eec99cfd8&oe=598279CC'
	},
	c: {
		name: 'Calvin Zhu',
		picture: 'https://scontent.xx.fbcdn.net/v/t1.0-1/c27.0.160.160/p160x160/17103428_1263265467090223_4727107438582250385_n.jpg?oh=157d9b17bdb55b27292cccec0ef48d58&oe=59B405D1'
	},
	v: {
		name: 'Vinesh Kannan',
		picture: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p160x160/16105758_1054398484705990_6386797828324798282_n.jpg?oh=647334bf8d7d00b46b84eec1df0f3c0e&oe=597916DE'
	}
};

mainRatings({users: FAKE_TEAM});






