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

function displayError(msg){
	vex.dialog.alert({
		message: msg
	});
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

/*{
	usc: 'malik',
	name: 'Malik Roberson',
	email: false,
	picture: false,
	course: 'ttownsend3',
	tid: false
}*/

let stageStudent = (params) => {
	return new Promise((resolve, reject) => {
		// Add error checking
		if(!params.picture){
			params.picture = 'http://vingkan.github.io/omnipointment/img/empty-user-img.png';
		}
		let gRef = OmniDB.ref('prometheus/users/' + params.usc + '/profile');
		let p1 = gRef.set({
			name: params.name,
			email: params.email,
			picture: params.picture,
			type: 'usc',
			course: params.course,
			tid: params.tid
		});
		p1.then(done => {
			let tRef = LabsDB.ref('omniteams/teams/' + params.tid + '/members/' + params.usc);
			let p2 = tRef.set(true);
			p2.then(resolve).catch(reject);
		}).catch(reject);
	});
}

/* Main Routine */

//let USER_ID = '568eb4e705d347a26a94ecc4';
//let TEAM_ID = '-Kj9u7wuTAvJhwzfGHg2';

let queryParams = getQueryParams(document.location.search);
let USC = queryParams.usc;
let USER_ID = false;

let prometheus = Prometheus(OmniFirebaseConfig);

let init = (uid) => {
	try{
		USER_ID = uid;

		if(!USC){
			throw new Error('Missing unique student code. Use the link you received by email.');
		}

		prometheus.logon(USER_ID);
		prometheus.save({
			type: 'OPEN_USC_SIGNUP',
			usc: USC
		});

		getUser(USC).then(user => {
			if(!user){
				throw new Error('Unique student code is not valid. Check your signup link or ask your instructor for help.');
			}
			let givenName = user.name;
			let gRef = OmniDB.ref('prometheus/users/' + USER_ID + '/profile/name')
			let p = gRef.set(givenName);
			p.then(done => {
				let params = {
					usc: USC,
					uid: USER_ID,
					course: user.course,
					tid: user.tid
				}
				main(params).then(finish).catch(err => {
					displayError(err);
				});
			}).catch(err => {
				displayError(err);
			});
		}).catch(err => {
			displayError(err);
		});
	}
	catch(err){
		displayError(err);
	}
}

/*
 * ASSUMPTIONS
 * 
 */
let main = (params) => {
	return new Promise((resolve, reject) => {

		// Add error checking

		let oldMemberRef = LabsDB.ref('omniteams/teams/' + params.tid + '/members/' + params.usc);
		let newMemberRef = LabsDB.ref('omniteams/teams/' + params.tid + '/members/' + params.uid);
		let ratingsRef = LabsDB.ref('omniteams/ratings/' + params.tid);
		let ratingsQuery = ratingsRef.orderByChild('to').startAt(params.usc).endAt(params.usc);
		let oldPrometheusRef = OmniDB.ref('prometheus/users/' + params.usc);

		newMemberRef.set(true).then(done => {
			oldMemberRef.remove().then(done => {
				ratingsQuery.once('value', snap => {
					let nodePromises = [];
					let nodes = snap.val();
					for(let nid in nodes){
						let nRef = LabsDB.ref('omniteams/ratings/' + params.tid + '/' + nid + '/to');
						let nProm = nRef.set(params.uid);
						nodePromises.push(nProm);
					}
					Promise.all(nodePromises).then(allProms => {
						oldPrometheusRef.remove().then(done => {
							resolve(params);
						}).catch(reject);
					}).catch(reject);
				});
			}).catch(reject);
		}).catch(reject);

	}); 
}

let finish = (params) => {

	console.log('Finished successfully.');

	console.log(params)

	prometheus.save({
		type: 'FINISH_USC_SIGNUP',
		usc: USC,
		course: params.course,
		tid: params.tid
	});

	let tUrl = document.location.origin + '/team.html?team=' + params.tid;
	console.log(tUrl);
	document.location = tUrl;

}

var authConfig = {
	localStorageTag: 'prometheus_user_omnipointment',
	loginRedirectURL: 'https://www.omnipointment.com/login',
	xdSourceURL: 'https://www.omnipointment.com/nothingtoseehere.html'
}

wineGlassAuth(authConfig).then(init).catch(err => {
	if(err.type === 'POPUP_BLOCKED'){
		displayError(err.message);
	}
	else{
		displayError(err);
	}
});