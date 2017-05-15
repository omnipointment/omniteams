const CATEGORY_LIST = [
	{
		name: 'Contributing to the Team\'s Work',
		id: 'contibuting',
		type: 'behavior',
		question: 'How is %NAME% at contributing to the team\'s work?',
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
		type: 'behavior',
		question: 'How is %NAME% at interacting with teammates?',
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
		type: 'behavior',
		question: 'How is %NAME% at keeping the team on track?',
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
		type: 'behavior',
		question: 'How is %NAME% at expecting quality?',
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
		type: 'behavior',
		question: 'How is %NAME% at having relevant knowledge, skills, and abilities?',
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
	},
	{
		name: 'Additional Feedback',
		id: 'comment',
		type: 'comment',
		question: 'What other feedback do you have for %NAME%?'
	}
];