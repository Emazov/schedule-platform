export const departments = [
	{ id: 1, code: 'com', title: 'Computer Science' },
	{ id: 2, code: 'math', title: 'Applied Mathematics and Informatics' },
	{ id: 3, code: 'eeair', title: 'Artificial Intelligence and Robotics' },
	{ id: 4, code: 'iemit', title: ' Management in Information Technology' },
];

export const groups = [
	// Computer Science
	{ id: 1, year: 24, departmentId: 1, code: 'comceh' },
	{ id: 2, year: 24, departmentId: 1, code: 'comse' },
	{ id: 3, year: 24, departmentId: 1, code: 'comfci' },
	{ id: 4, year: 23, departmentId: 1, code: 'comsep' },
	{ id: 5, year: 23, departmentId: 1, code: 'comceh' },
	{ id: 6, year: 23, departmentId: 1, code: 'comse' },
	{ id: 7, year: 23, departmentId: 1, code: 'comfci' },
	{ id: 8, year: 22, departmentId: 1, code: 'com', subgroup: 'a' },
	{ id: 9, year: 22, departmentId: 1, code: 'com', subgroup: 'b' },
	{ id: 10, year: 21, departmentId: 1, code: 'com' },

	// Mathematics
	{
		id: 11,
		year: 24,
		departmentId: 2,
		code: 'matdais',
	},
	{ id: 12, year: 24, departmentId: 2, code: 'matmie' },
	{
		id: 13,
		year: 23,
		departmentId: 2,
		code: 'matdais',
		title: 'MATDAIS-23',
	},
	{ id: 14, year: 23, departmentId: 2, code: 'matmie' },
	{ id: 15, year: 22, departmentId: 2, code: 'math' },
	{ id: 16, year: 21, departmentId: 2, code: 'math' },

	// Artificial Intelligence and Robotics
	{ id: 17, year: 24, departmentId: 3, code: 'eeair' },
	{ id: 18, year: 23, departmentId: 3, code: 'eeair' },

	// Management in Information Technology
	{ id: 19, year: 24, departmentId: 4, code: 'iemit' },
	{ id: 20, year: 23, departmentId: 4, code: 'iemit' },
];
