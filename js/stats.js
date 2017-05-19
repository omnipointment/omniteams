let initCategoryMap = (callback) => {
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

let initCategoryList = () => {
	return CATEGORY_LIST.filter(category => {
		return category.type === 'behavior';
	}).map(category => {
		return category.id;
	});
}

let selectFromList = (list, params) => {
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

let averageList = (list) => {
	let sum = 0;
	list.forEach(item => {
		sum += item;
	});
	let avg = sum / list.length;
	return avg;
}

let getWrappedIndex = (list, index) => {
	var idx = index % list.length;
	return idx;
}

let shuffleWithSeed = (list, seed) => {
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

let normalizeRatings = (inRatings, range) => {
	return inRatings.map(rate => {
		if(rate.level){
			let level = parseFloat(rate.level);
			let per = (level - range.old[0]) / (range.old[1] - range.old[0]);
			let normalized = (per * (range.new[1] - range.new[0])) + range.new[0];
			rate.level = normalized;
		}
		return rate;
	});
}

let variance = (list) => {
	let e_x_2 = Math.pow(averageList(list), 2);
	let e_x2 = averageList(list.map(val => Math.pow(val, 2)));
	return e_x2 - e_x_2;
}

let stdev = (list) => {
	return Math.sqrt(variance(list));
}

let assessOutlier = (team_ratings, category_id, user_id) => {

	let peerRatingList = selectFromList(team_ratings, {
		category: category_id,
		to: user_id
	}).filter(rate => {
		return rate.from !== user_id;
	}).map(rate => rate.level);
	let selfRatingValue = selectFromList(team_ratings, {
		category: category_id,
		from: user_id,
		to: user_id
	})[0];

	let t_value = 3.182; //2.353; //4.541; //Assumes df = 3 lol
	let x_bar = averageList(peerRatingList);
	let sigma = stdev(peerRatingList);
	let n = peerRatingList.length;
	let interval_width = t_value * (sigma / Math.sqrt(n));
	let confidence_interval = [
		x_bar - interval_width,
		x_bar + interval_width
	];

	let in_interval = (selfRatingValue >= confidence_interval[0] && selfRatingValue <= confidence_interval[1]);
	let mean_diff = selfRatingValue - x_bar;

	console.log(category_id)
	console.log(peerRatingList)
	console.log(confidence_interval, selfRatingValue);

	let res = {
		outlier: !in_interval,
		sign: mean_diff / Math.abs(mean_diff)
	}

	if(res.outlier){
		if(res.sign > 0){
			console.log('overconfident');
		}
		else{
			console.log('underconfident');
		}
	}
	else{
		console.log('normal');
	}

	return res;
}

let getTeamModel = (data) => {

	let model = {
		ratings: data.ratings
	};

	let strengths = initCategoryList().map(id => {
		let sum = 0;
		selectFromList(data.ratings, {
			category: id
		}).forEach(rate => {
			sum += rate.level;
		});
		return {
			category: id,
			value: sum
		}
	}).sort((a, b) => {
		return b.value - a.value;
	});

	model.strongest = strengths[0].category;
	model.weakest = strengths[strengths.length-1].category;

	return model;

}




