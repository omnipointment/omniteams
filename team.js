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

function parseMeetingName(name){
	var res = false;
	if(name === 'My Meetings' || name === 'Omnipointment'){
		res = false;
	}
	else if(name.indexOf('Edit') === 0){
		res = name.substr(5);
	}
	else if(name.indexOf('Respond to') === 0){
		res = name.substr(11);
	}
	else if(name.indexOf('Team Ratings') === 0){
		res = name.substr(13);
	}
	return res;
}

function getRecentMeetings(){
	return new Promise((resolve, reject) => {
		var startDate = Date.now() - 2 * WEEK;
		var endDate = Date.now();
		var ref = OmniDB.ref('prometheus/visits/' + UID + '/');
		var query = ref.orderByChild('meta/datetime/timestamp').startAt(startDate).endAt(endDate);
		query.once('value', snap => {
			var val = snap.val() || {};
			var nodes = Object.keys(val).map(i => val[i]);
			var nameMap = {};
			nodes.forEach(node => {
				var mid = node.visit.mid;
				if(mid){
					name = parseMeetingName(node.meta.page.title);
					// WHY DOES THIS COME OUT AS A STRING
					if(name !== 'false'){
						nameMap[mid] = name;	
					}
				}
			});
			var allMids = nodes.filter(node => {
				var mid = node.visit.mid;
				if(mid === 'sample'){
					mid = false;
				}
				return mid;
			}).map(node => node.visit.mid);
			var mids = uniqueList(allMids);
			var meetings = mids.map(mid => {
				return {
					mid: mid,
					name: nameMap[mid] || 'Untitled Meeting'
				}
			});
			resolve(meetings);
		}).catch(reject);
	});
}

function renderRecentMeetings(holder, meetings, exclude){
	var excludeMap = exclude || {};
	holder.innerText = '';
	meetings.forEach(meeting => {
		if(!(meeting.mid in excludeMap)){
			var div = document.createElement('div');
			var mDiv = document.createElement('a');
				mDiv.innerText = meeting.name;
				mDiv.classList.add('div--inline');
				mDiv.href = 'https://www.omnipointment.com/meeting/' + meeting.mid + '?rdr=false';
				mDiv.target = '_blank';
			var ic = document.createElement('i');
				ic.classList.add('fa', 'fa-icon', 'fa-external-link');
				ic.style.marginLeft = '5px';
				mDiv.appendChild(ic);
			var mButton = document.createElement('button');
				mButton.innerText = 'Yes';
				mButton.dataset.mid = meeting.mid;
				mButton.dataset.meeting_name = meeting.name;
				mButton.classList.add('btn', 'btn--inline', 'btn--ghost');
				mButton.addEventListener('click', e => {
					var mid = e.target.dataset.mid;
					var meeting_name = e.target.dataset.meeting_name;
					addMeetingToTeam(TEAM_ID, mid, {
						name: meeting_name
					}).then(done => {
						e.target.parentNode.style.display = 'none';
					});
				});
			var nButton = document.createElement('button');
				nButton.innerText = 'No';
				nButton.dataset.mid = meeting.mid;
				nButton.classList.add('btn', 'btn--inline', 'btn--ghost');
				nButton.addEventListener('click', e => {
					var mid = e.target.dataset.mid;
					ignoreMidForTeam(TEAM_ID, mid).then(done => {
						e.target.parentNode.style.display = 'none';
					});
				});
				div.appendChild(mButton);
				div.appendChild(nButton);
				div.appendChild(mDiv);
			holder.appendChild(div);
		}
	});
}

function renderTeamChoices(holder, teams){
	holder.innerText = '';
	teams.forEach(team => {
		var div = document.createElement('div');
		var mDiv = document.createElement('div');
			mDiv.innerText = team.name;
		var mButton = document.createElement('button');
			mButton.innerText = 'Go';
			mButton.dataset.tid = team.tid;
			mButton.addEventListener('click', e => {
				var tid = e.target.dataset.tid;
				selectTeam(tid);
			});
			mDiv.classList.add('div--inline');
			mButton.classList.add('btn', 'btn--inline', 'btn--ghost');
			div.appendChild(mButton);
			div.appendChild(mDiv);
		holder.appendChild(div);
	});
}

function fillTextSpans(spanClass, text){
	var spans = document.getElementsByClassName(spanClass);
	for(var s = 0; s < spans.length; s++){
		var span = spans[s];
		span.innerText = text;
	}
}

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
				var tid = res.path['o'][2];
				team = FormatTeam(team, tid);
				resolve(team);
			}).catch(reject);			
		}
		else{
			reject('No team name given.');
		}
	});
}

function getTeams(){
	return new Promise((resolve, reject) => {
		var ref = LabsDB.ref('omniteams/teams')
		var query = ref.orderByChild('members/' + UID).startAt(true).endAt(true);
		query.once('value', snap => {
			var val = snap.val() || {};
			var teams = Object.keys(val).map(tid => {
				var team = val[tid];
				team = FormatTeam(team, tid);
				return team;
			});
			resolve(teams);
		}).catch(reject);
	});
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

function initClosers(){
	var closers = document.getElementsByClassName('container-closer');
	for(var c = 0; c < closers.length; c++){
		closer = closers[c];
		closer.addEventListener('click', e => {
			var parent = e.target.parentNode;
			if(parent){
				parent.style.display = 'none';
			}
		});
	}
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

function addMeetingToTeam(tid, mid, meeting){
	var meetingData = meeting || {name: false};
	return new Promise((resolve, reject) => {
		var ref = LabsDB.ref('omniteams/teams/' + tid + '/meetings/' + mid);
		ref.set(meetingData).then(res => {
			resolve(true);
		}).catch(reject);
	});
}

function ignoreMidForTeam(tid, mid){
	return new Promise((resolve, reject) => {
		var ref = LabsDB.ref('omniteams/teams/' + tid + '/ignoremids/' + mid);
		ref.set(true).then(res => {
			resolve(true);
		}).catch(reject);
	});
}

function joinTeam(tid, uid){
	return new Promise((resolve, reject) => {
		var ref = LabsDB.ref('omniteams/teams/' + tid + '/members/' + uid);
		ref.set(true).then(resolve).catch(reject);
	});
}

function mainHome(){
	getTeams().then(teams => {
		var teamContainer = document.getElementById('team-choices-container');
			teamContainer.style.display = 'block';
		var teamHolder = document.getElementById('team-choices');
			renderTeamChoices(teamHolder, teams);
		var createTeamButton = document.createElement('button');
			createTeamButton.innerText = 'Create New Team';
			createTeamButton.addEventListener('click', e => {
				vex.dialog.prompt({
					message: 'Team Name',
					callback: value => {
						createNewTeam(value).then(team => {
							selectTeam(team.tid);
						});
					}
				});
			});
			createTeamButton.classList.add('btn', 'btn--center', 'btn--primary');
			teamHolder.appendChild(createTeamButton);
	});

	getUser(UID).then(user => {
		var holder = document.getElementById('user-holder');
		var div = document.createElement('div');
			div.classList.add('member');
		var pic = document.createElement('div');
			pic.style.background = 'url("' + user.picture + '")'
		var name = document.createElement('div');
			name.innerText = 'Welcome, ' + user.name + '.';
			div.appendChild(pic);
			div.appendChild(name);
			holder.appendChild(div);
	});
}

function getUserTeamNodes(uid, team){
	return new Promise((resolve, reject) => {
		var startDate = Date.now() - (12 * WEEK);
		var endDate = Date.now();
		var ref = OmniDB.ref('prometheus/visits/' + uid);
		var query = ref.orderByChild('meta/datetime/timestamp').startAt(startDate).endAt(endDate);
		query.once('value', snap => {
			var nodes = snap.val() || {};
			var forAward = [];
			for(var v in nodes){
				var visit = nodes[v].visit;
				var meta = nodes[v].meta;
				if(visit.mid){
					if(visit.mid in team.meetings){
						forAward.push(nodes[v]);
					}
				}
			}
			resolve({
				uid: uid,
				nodes: forAward
			});
		}).catch(reject);
	});
}

function Award(config){
	var award = {
		title: config.title || 'Untitled Award',
		description: config.description || 'No Description',
		icon: config.icon || 'fa-star',
		candidates: [],
		nominate: (cand) => {
			if(!cand.nodes){
				throw Error('Missing nodes.');
			}
			if(!cand.uid){
				throw Error('Missing uid.');
			}
			award.candidates.push(cand);
		},
		score: config.score || null,
		rank: config.rank || null,
		crown: () => {
			for(var c = 0; c < award.candidates.length; c++){
				var cand = award.candidates[c];
				if(award.score){
					cand.score = award.score(cand.nodes);
				}
			}
			award.candidates = award.candidates.filter(cand => {
				return cand.score;
			});
			if(award.candidates.length < 1){
				return false;
			}
			else{
				if(award.rank){
					return award.candidates.sort(award.rank)[0];
				}
				else{
					return award.candidates[0];
				}
			}
		},
		present: () => {
			return {
				title: award.title,
				description: award.description,
				icon: award.icon
			}
		}
	}
	return award;
}

function getTeamAchievements(team, awards){
	return new Promise((resolve, reject) => {
		var promises = [];
		var uids = Object.keys(team.members);
		uids.forEach(uid => {
			var p = getUserTeamNodes(uid, team);
			promises.push(p);
		});
		Promise.all(promises).then(data => {
			data.forEach(user => {
				var uid = user.uid;
				var nodes = user.nodes;
				awards.forEach(award => {
					award.nominate(user);
				});
			});
			var res = {};
			awards.forEach(award => {
				var winner = award.crown();
				var prize = award.present();
				if(!res[winner.uid]){
					res[winner.uid] = [];
				}
				res[winner.uid].push(prize);
			});
			resolve(res);
		}).catch(reject);
	});
}

var AWARDS = [];

AWARDS.push(Award({
	title: 'Fastest Responder',
	description: 'No one can keep up with your scheduling speed!',
	icon: 'fa-fighter-jet',
	score: (nodes) => {
		var meetings = {};
		nodes.forEach(node => {
			var visit = node.visit;
			var ts = node.meta.datetime.timestamp;
			if(visit.type === 'EDIT_MEETING'){
				meetings[visit.mid] = 'CREATOR';
			}
			if(visit.type === 'RSVP'){
				if(!meetings[visit.mid]){
					meetings[visit.mid] = ts;
				}
				else if(meetings[visit.mid] === 'CREATOR'){
					// Ignore
				}
				else if(ts < meetings[visit.mid]){
					meetings[visit.mid] = ts;
				}
			}
		});
		var nominate = false;
		for(var m in meetings){
			if(meetings[m] === 'CREATOR'){
				meetings[m] = Infinity;
			}
			else{
				nominate = true;
			}
		}
		return nominate ? {meetings: meetings} : false;
	},
	rank: (a, b) => {
		var ac = 0;
		var bc = 0;
		var am = a.score.meetings;
		var bm = b.score.meetings;
		var allMids = Object.keys(am);
		allMids.push.apply(allMids, Object.keys(bm));
		allMids = uniqueList(allMids);
		for(var m = 0; m < allMids.length; m++){
			var mid = allMids[m];
			var at = am[mid] || Infinity;
			var bt = bm[mid] || Infinity;
			if(at < bt){
				ac++;
			}
			else if(bt < at){
				bc++;
			}
			else{
				ac++;
				bc++;
			}
		}
		return bc - ac;
	}
}));

AWARDS.push(Award({
	title: 'Most Generous',
	description: 'You offer the most free time to the team!',
	icon: 'fa-calendar',
	score: (nodes) => {
		var slots = 0;
		nodes.forEach(node => {
			var visit = node.visit;
			var ts = node.meta.datetime.timestamp;
			if(visit.timerID === 'rsvp'){
				var delta = visit.free_after - visit.free_before;
				slots += delta;
			}
		});
		return slots > 0 ? slots : false;
	},
	rank: (a, b) => {
		return b.score - a.score;
	}
}));

AWARDS.push(Award({
	title: 'Most Constructive',
	description: 'You care the most about giving your teammates feedback!',
	icon: 'fa-comment',
	score: (nodes) => {
		var count = 0;
		nodes.forEach(node => {
			var visit = node.visit;
			var ts = node.meta.datetime.timestamp;
			if(visit.type === 'RATING_POINTS' || visit.type === 'RATING'){
				count++;
			}
		});
		return count > 0 ? count : false;
	},
	rank: (a, b) => {
		return b.score - a.score;
	}
}));

function renderMembers(holder, members, team){
	holder.innerHTML = '';
	var promises = [];
	members.forEach(uid => {
		var p = getUser(uid);
			p.uid = uid;
		promises.push(p);
	});
	Promise.all(promises).then(users => {
		getTeamAchievements(team, AWARDS).then(achievements => {
			var p = document.createElement('p');
				p.innerText = 'Invite other teammates by sending them ';
			var a = document.createElement('a');
				a.innerText = 'this link.';
				a.classList.add('copy-link');
				p.appendChild(a);
			holder.appendChild(p);
			users.forEach((user, udx) => {
				var uid = promises[udx].uid;
				var div = document.createElement('div');
					div.classList.add('member');
				var pic = document.createElement('div');
					pic.style.background = 'url("' + user.picture + '")'
				var name = document.createElement('div');
					name.innerText = user.name;
					div.appendChild(pic);
					div.appendChild(name);
					if(uid in achievements){
						achievements[uid].forEach(award => {
							var awdDiv = document.createElement('div');
								awdDiv.classList.add('award-icon');
							var awd = document.createElement('i');
							awd.classList.add('fa', award.icon);
							var html = '';
								html += '<h2>' + award.title + '</h2>'
								html += '<p>Awarded to ' + user.name + '.</p>'
								html += '<p>' + award.description + '</p>'
							awd.addEventListener('click', e => {
								vex.dialog.open({
									unsafeMessage: html,
									buttons: [
										$.extend({}, vex.dialog.buttons.YES, {text: 'Thanks!'})
									]
								});
							});
							awdDiv.appendChild(awd);
							div.appendChild(awdDiv);
						});
					}
					holder.appendChild(div);
			});
		});
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
			card.innerText = item.text;
			if(item.url){
				var ic = document.createElement('i');
					ic.classList.add('fa', 'fa-external-link', 'small');
					ic.style.marginLeft = '5px';
				card.appendChild(ic);
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

function renderMeetings(holder, inMeetings, team){
	var meetings = inMeetings || {};
	holder.innerHTML = '';
	/*for(var mid in meetings){
		var meeting = meetings[mid];
		var div = document.createElement('div');
		var a = document.createElement('a');
			a.href = 'https://www.omnipointment.com/meeting/' + mid + '?rdr=false';
			a.target = '_blank';
			a.innerText = meeting.name || 'Untitled Meeting';
			a.classList.add('btn', 'btn--block', 'btn--ghost');
			div.appendChild(a);
			holder.appendChild(div);
	}*/
	var mtgList = Object.keys(meetings).map(mid => {
		return {
			text: meetings[mid].name,
			url: 'https://www.omnipointment.com/meeting/' + mid + '?rdr=false'
		}
	});
	var meetingCards = renderCards(mtgList, 'col--onefourth-xs');
	holder.appendChild(meetingCards);
	var createLink = document.createElement('button');
		createLink.addEventListener('click', e => {
			window.open('https://www.omnipointment.com/meeting/create');
		})
		createLink.innerText = 'Organize New Meeting';
		createLink.classList.add('btn', 'btn--center', 'btn--primary');
		holder.appendChild(createLink);
}

function renderPins(holder, pinMap, team){
	holder.innerHTML = '';
	var ul = document.createElement('ul');
	var pins = pinMap || {};
	if(Object.keys(pins).length === 0){
		pins.sample = {
			text: 'Pin important URLs or team goals for all team members to see.'
		}
	}
	for(var pid in pins){
		var pin = pins[pid];
		var div = document.createElement('li');
			if(pin.url){
				var a = document.createElement('a');
					a.href = pin.url;
					a.target = '_blank';
					a.innerText = pin.text;
					div.appendChild(a);
			}
			else{
				var s = document.createElement('span');
				s.innerText = pin.text;
				div.appendChild(s);
			}
			if(UID === team.owner){
				var rem = document.createElement('span');
					rem.classList.add('pin-remover');
					rem.dataset.pid = pid;
					rem.innerText = 'x';
					rem.addEventListener('click', e => {
						var pid = e.target.dataset.pid;
						removePin(TEAM_ID, pid);
					});
				div.appendChild(rem);
			}
			ul.appendChild(div);
	}
	holder.appendChild(ul);
	var button = document.createElement('button');
		button.innerText = 'Add Pinned Item';
		button.classList.add('btn', 'btn--center', 'btn--primary');
		button.addEventListener('click', e => {
			vex.dialog.prompt({
				message: 'What would you like to pin?',
				placeholder: 'Try a URL or new team goal.',
				callback: value => {
					if(value.indexOf('http') > -1){
						vex.dialog.prompt({
							message: 'Link Title',
							callback: linkTitle => {
								if(linkTitle){
									addPin(TEAM_ID, {
										text: linkTitle,
										url: value
									});
								}
								else{
									addPin(TEAM_ID, {
										text: value
									});
								}
							}
						})
					}
					else{
						addPin(TEAM_ID, {
							text: value
						});
					}
				}
			});
		});
		holder.appendChild(button);
}

function addPin(tid, pin){
	var ref = LabsDB.ref('omniteams/teams/' + tid + '/pins');
		ref.push(pin);
}

function removePin(tid, pid){
	var ref = LabsDB.ref('omniteams/teams/' + tid + '/pins/' + pid);
		ref.remove();
}

function selectTeam(tid){
	if(tid){
		if(params.team !== tid){
			var teamURL = window.location.origin + window.location.pathname + '?team=' + tid;
			window.location = teamURL;
		}
		else{
			TEAM_ID = tid;
			var choicesContainer = document.getElementById('team-choices-container');
				choicesContainer.style.display = 'none';
			var teamContainer = document.getElementById('team-container');
				teamContainer.style.display = 'block';
			mainTeam();
		}
	}
	else{
		mainHome();
	}
}

function mainTeam(){

	getTeam(TEAM_ID).then(team => {
		
		if(!(UID in team.members)){
			document.getElementById('page').style.opacity = 0.25;
			vex.dialog.open({
				message: 'Are you a member of ' + team.name + '?',
				buttons: [
					$.extend({}, vex.dialog.buttons.YES, {text: 'Yes, join the team.'}),
					$.extend({}, vex.dialog.buttons.NO, {text: 'No, get me outta here!'})
				],
				callback: value => {
					if(value){
						joinTeam(TEAM_ID, UID).then(done => {
							window.location.reload();
						});
					}
					else{
						window.location = window.location.origin + window.location.pathname;
					}
				}
			});
		}

		fillTextSpans('fill-team', team.name);
		
		getRecentMeetings().then(meetings => {
			var exclude = team.meetings;
			var meetingList = meetings.filter(meeting => {
				var keep = true;
				if(meeting.mid in team.meetings){
					keep = false;
				}
				if(meeting.mid in team.ignoremids){
					keep = false;
				}
				return keep;
			});
			if(meetingList.length > 0){
				var rmContainer = document.getElementById('recent-meetings-container');
					rmContainer.style.display = 'block';
				var rmHolder = document.createElement('div');
				renderRecentMeetings(rmHolder, meetingList);
				rmContainer.appendChild(rmHolder);				
			}
		});

	}).catch(err => {
		window.location = window.location.origin + window.location.pathname;
	});

	var teamRef = LabsDB.ref('omniteams/teams/' + TEAM_ID);
	teamRef.on('value', snap => {
		var team = snap.val();
		team = FormatTeam(team, TEAM_ID);
		var pinCont = document.getElementById('pins-container');
			renderPins(pinCont, team.pins, team);
		var memCont = document.getElementById('members-container');
			var members = Object.keys(team.members).sort((a, b) => {
				var ai = team.owner === a ? 1 : 0;
				var bi = team.owner === b ? 1 : 0;
				return bi - ai;
			});
			renderMembers(memCont, members, team);
		var metCont = document.getElementById('meetings-container');
			renderMeetings(metCont, team.meetings, team);
	});

	var copyLink = new Clipboard('.copy-link', {
		text: trigger => {
			return window.location.href;
		}
	});
	copyLink.on('success', e => {
		vex.dialog.prompt({
			message: 'Link copied. Now, it share with your teammates!',
			value: window.location.href,
			callback: value => {

			}
		});
	});

	initClosers();

}

// Not working: should just add name param to Prometheus
function getNameFromMID(mid, uid){
	var url = 'https://www.omnipointment.com/meeting/' + mid + '?rdr=false';
	var midWin = window.open(url);
	window.midWin = midWin;
	var ref = OmniDB.ref('prometheus/visits/' + uid);
	var query = ref.orderByChild('meta/datetime/timestamp').limitToLast(1);
	query.once('value', snap => {
		var val = snap.val();
		console.log(val);
	});
}

function changeTeamID(oldID, newID){
	var oldRef = LabsDB.ref('omniteams/teams/' + oldID);
	var newRef = LabsDB.ref('omniteams/teams/' + newID);
	newRef.once('value', snap => {
		var val = snap.val();
		if(!val){
			oldRef.once('value', teamSnap => {
				var team = teamSnap.val();
				newRef.set(team).then(done => {
					oldRef.remove().then(removed => {
						selectTeam(newID);
					});
				});
			});
		}
	});
}

function displayError(msg){
	vex.dialog.alert({
		message: msg
	});
}

var UID = null;
var params = {};
var TEAM_ID = null;
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
	var PROMO_CODE = params.code;
	TEAM_ID = params.team;

	var giveFeedback = document.getElementById('give-feedback');
	giveFeedback.addEventListener('click', e => {
		vex.dialog.prompt({
			message: 'Share your feedback here.',
			placeholder: 'Your feedback.',
			callback: value => {
				prometheus.save({
					type: 'TEAM_PAGES_FEEDBACK',
					feedback: value
				});
			}
		});
	});

	if(PROMO_CODE){
		prometheus.redeem(PROMO_CODE, success => {
			var html = ''
				html += '<h2>' + success.title + '</h2>'
				html += '<p>' + success.description + '</p>'
			vex.dialog.alert({
				unsafeMessage: html
			});
		}, failure => {
			vex.dialog.alert(failure);
		}, {
			silent: true
		});
	}
	if(TEAM_ID){
		selectTeam(TEAM_ID);
	}
	else{
		mainHome();
	}
}

const els = document.querySelectorAll('.toggle');
els.forEach(el => {
	let elToggle = el.querySelector('.toggle__section');
	elToggle.addEventListener('click', () => el.classList.toggle('is-expanded'));
});