export type Id = number;

export type Day = {
	id: Id;
	code: string;
	title: string;
};

export type TimeSlot = {
	id: Id;
	slot: string;
	start: string;
	end: string;
};

export type AuthState = {
	isAuth: boolean;
	role: string;
	email: string;
};

export type Role = {
	id: Id;
	code: string;
	name: string;
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
	title: string;
};

export type Lesson = {
	id: Id;
	code: string;
	title: string;
	color: string;
};

export type Teacher = {
	id: Id;
	code: string;
	title?: string;
	name: string;
	email: string;
};

export type Room = {
	id: Id;
	code: string;
	name: string;
};

export type Schedule = {
	id: Id;
	lessonId: Id;
	groupId: Id;
	timeStartId: Id;
	duration: number;
	dayId: Id;
	teacherId?: Id;
	roomId?: Id;
};
