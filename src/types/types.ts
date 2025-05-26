export type Id = number;

export type Day = {
	id: Id;
	code: string;
	shortCode: string;
};

export type TimeSlot = {
	id: Id;
	slot: string;
	start: string;
	end: string;
};

export type Block = {
	id: Id;
	code: string;
};

export type Room = {
	id: Id;
	blockId: Id;
	code: string;
};

export type Teacher = {
	id: Id;
	role: string;
	title?: string;
	firstName: string;
	lastName: string;
	email: string;
};

export type Department = {
	id: Id;
	code: string;
	title: string;
};

export type Group = {
	id: Id;
	year: number;
	departmentId: Id;
	code: string;
	subgroup?: string;
};

export type Lesson = {
	id: Id;
	code?: string;
	elective?: string;
	title: string;
	departments: Id[];
	color: string;
};

export type Event = {
	id: Id;
	title: string;
	color: string;
};

export type Schedule = {
	id: Id;
	lessonId?: Id;
	eventId?: Id;
	groupId: Id;
	timeStartId: Id;
	duration: number;
	dayId: Id;
	teacherId?: Id;
	roomId?: Id;
};

export type AuthState = {
	isAuth: boolean;
	role: string;
	email: string;
};
