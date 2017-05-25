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

function uniqueList(list){
	var arr = [];
	for(var i = 0; i < list.length; i++){
		if(arr.indexOf(list[i]) < 0){
			arr.push(list[i]);
		}
	}
	return arr;
}

var MINUTE = 60 * 1000;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var WEEK = 7 * DAY;

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

function fillTextSpans(spanClass, text){
	var spans = document.getElementsByClassName(spanClass);
	for(var s = 0; s < spans.length; s++){
		var span = spans[s];
		span.innerText = text;
	}
}

function addMeetingToTeam(tid, mid, meeting){
	var meetingData = meeting || {name: false};
	return new Promise((resolve, reject) => {
		var ref = LabsDB.ref('omniteams/teams/' + tid + '/meetings/' + mid);
		ref.set(meetingData).then(res => {
			resolve(true);
		}).catch(reject);
	});
}

function joinTeam(tid, uid){
	prometheus.save({
		type: 'JOIN_COURSE_TEAM',
		tid: tid
	});
	return new Promise((resolve, reject) => {
		var ref = LabsDB.ref('omniteams/teams/' + tid + '/members/' + uid);
		ref.set(true).then(resolve).catch(reject);
	});
}

function renderCards(list, cardClass){
	var holder = document.createElement('div');
		holder.classList.add('landingSection--newsroom');
	var row = document.createElement('div');
		row.classList.add('row', 'row--condensed');
	list.forEach(item => {
		var col = document.createElement('div');
			col.classList.add('col', cardClass);
		var card = document.createElement('div');
			card.classList.add('card__headline');
			if(item.el){
				card.appendChild(item.el);
			}
			else{
				card.innerText = item.text;
				if(item.url){
					var ic = document.createElement('i');
						ic.classList.add('fa', 'fa-external-link', 'small');
						ic.style.marginLeft = '5px';
					card.appendChild(ic);
				}
			}
		if(item.url){
			var a = document.createElement('a');
				a.href = item.url;
				a.target = '_blank';
				a.appendChild(card);
				col.appendChild(a);
		}
		else{
			col.appendChild(card);
		}
		row.appendChild(col);
	});
	holder.appendChild(row);
	return holder;
}

function createNewTeam(name){
	return new Promise((resolve, reject) => {
		if(name){
			var members = {};
				members[UID] = true;
			var team = {
				name: name,
				owner: UID,
				members: members
			}
			LabsDB.ref('omniteams/teams').push(team).then(res => {
				team.tid = res.path['o'][2];
				resolve(team);
			}).catch(reject);			
		}
		else{
			reject('No team name given.');
		}
	});
}

function createCourseTeam(name, courseCode){
	return new Promise((resolve, reject) => {
		createNewTeam(name).then(team => {
			LabsDB.ref('omniteams/teams/' + team.tid + '/course').set(courseCode).then(done => {
				prometheus.save({
					type: 'CREATE_COURSE_TEAM',
					tid: team.tid,
					name: name,
					course: courseCode
				});
				resolve(team);
			}).catch(reject);
		}).catch(reject);
	});
}

function selectTeam(tid){
	var pathname = '/team.html';
	var teamURL = window.location.origin + pathname + '?team=' + tid;
	window.location = teamURL;
}

function joinCourse(promoCode){
	return new Promise((resolve, reject) => {
		prometheus.redeem(promoCode, success => {
			var html = ''
				html += '<h2>' + success.title + '</h2>'
				html += '<p>' + success.description + '</p>'
			vex.dialog.alert({
				unsafeMessage: html
			});
			resolve(promoCode);
		}, failure => {
			if(failure.type === 'ALREADY_USED'){
				resolve(promoCode);
			}
			else{
				vex.dialog.alert(failure);
				reject(failure);
			}
		}, {
			silent: true
		});
	});
}

function displayError(msg){
	vex.dialog.alert({
		message: msg
	});
}

var UID = null;
var params = {};
var prometheus = null;

var authConfig = {
	localStorageTag: 'prometheus_user_omnipointment',
	loginRedirectURL: 'https://www.omnipointment.com/login',
	xdSourceURL: 'https://www.omnipointment.com/nothingtoseehere.html'
}

wineGlassAuth(authConfig).then(initApp).catch(err => {
	if(err.type === 'POPUP_BLOCKED'){
		displayError(err.message);
	}
	else{
		displayError(err);
	}
});

function initApp(uid){
	UID = uid;

	prometheus = Prometheus(OmniFirebaseConfig);
	prometheus.logon(UID);

	params = getQueryParams(document.location.search);
	var COURSE = params.code;

	if(COURSE){
		joinCourse(COURSE).then(mainCourse);
	}
	else{
		vex.dialog.prompt({
			message: 'Enter your course code.',
			callback: value => {
				joinCourse(value).then(mainCourse);
			}
		});
	}

}

function mainCourse(courseCode){

	prometheus.save({
		type: 'COURSE_TEAM_SIGNUP_PAGE',
		course: courseCode
	});

	var courseRef = LabsDB.ref('omniteams/courses/' + courseCode);
	courseRef.once('value', snap => {
		var courseData = snap.val() || {};
		if(courseData.name){
			fillTextSpans('fill-course-name', courseData.name);
		}
	});

	var createButton = document.createElement('button');
		createButton.innerText = 'Start New Team';
		createButton.classList.add('btn', 'btn--center', 'btn--primary');
		createButton.addEventListener('click', e => {
			vex.dialog.prompt({
				message: 'Team Name',
				callback: value => {
					createCourseTeam(value, courseCode).then(team => {
						//selectTeam(team.tid);
					});
				}
			});
		});

	var ref = LabsDB.ref('omniteams/teams');
	var query = ref.orderByChild('course').startAt(courseCode).endAt(courseCode);
	query.on('value', snap => {
		var nodes = snap.val() || {};
		var promises = [];
		var teams = Object.keys(nodes).map(tid => {
			var team = FormatTeam(nodes[tid], tid);
			for(var uid in team.members){
				var p = getUser(uid);
					p.uid = uid;
					p.tid = team.tid;
				promises.push(p);
			}
			return team;
		});
		Promise.all(promises).then(users => {
			var teamUsers = {};
			users.forEach((user, uidx) => {
				var meta = promises[uidx];
				if(!teamUsers[meta.tid]){
					teamUsers[meta.tid] = {};
				}
				teamUsers[meta.tid][meta.uid] = user;
			});
			renderTeams(teams, teamUsers);
		});
	});

	function renderTeams(teams, teamUsers){

		var teamList = teams.map(team => {
			var el = document.createElement('div');
				el.classList.add('container');
			var h = document.createElement('h3');
				h.innerText = team.name;
				el.appendChild(h);
			for(var uid in team.members){
				var user = teamUsers[team.tid][uid] || {};
				var div = document.createElement('div');
					div.classList.add('member');
				var pic = document.createElement('div');
					pic.style.background = 'url("' + user.picture || 'no-image' + '")'
				var name = document.createElement('div');
					name.innerText = user.name || 'Unknown Student';
					div.appendChild(pic);
					div.appendChild(name);
					el.appendChild(div);
			}
			var jb = document.createElement('button');
				jb.innerText = 'Join Team';
				jb.classList.add('btn', 'btn--center', 'btn--primary');
				jb.dataset.tid = team.tid;
				jb.addEventListener('click', e => {
					var tid = e.target.dataset.tid;
					//console.log('Join Team: ' + tid);
					joinTeam(tid, UID).then(done => {
						selectTeam(tid);
					});
				});
				el.appendChild(jb);
			return {
				el: el
			}
		});

		var teamCards = renderCards(teamList, 'col--onethird-xs');
		var teamHolder = document.getElementById('team-container');
			teamHolder.innerHTML = '';
			teamHolder.appendChild(createButton);
			teamHolder.appendChild(teamCards);

	}

}
