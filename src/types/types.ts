export type Day = {
	id: number;
	code: string;
	title: string;
};

export type TimeSlot = {
	id: number;
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
	id: number;
	code: string;
	name: string;
};

export type Department = {
	id: number;
	code: string;
	title: string;
};

export type Group = {
	id: number;
	year: number;
	departmentId: number;
	code: string;
	title: string;
};

export type Lesson = {
	id: number;
	code: string;
	title: string;
	color: string;
};

export type Teacher = {
	id: number;
	code: string;
	title?: string;
	name: string;
	email: string;
};

export type Room = {
	id: number;
	code: string;
	name: string;
};

export type Schedule = {
	id: number;
	lessonId: number;
	groupId: number;
	timeStartId: number;
	duration: number;
	dayId: number;
	teacherId?: number;
	roomId?: number;
};
