import React from 'react';
import type { Teacher } from '@/types/types';

type TeacherSelectorProps = {
	teacherSearchQuery: string;
	setTeacherSearchQuery: (query: string) => void;
	filteredTeachers: Teacher[];
	teacherId: number;
	setTeacherId: (id: number) => void;
	formatTeacherName: (teacher: Teacher) => string;
	isTeacherAvailable: (teacherId: number) => boolean;
	error?: string;
	setErrors: (prev: any) => void;
	isOptional?: boolean;
};

/**
 * Component for selecting a teacher
 * Shows search, selected teacher, and list of available teachers
 */
const TeacherSelector: React.FC<TeacherSelectorProps> = ({
	teacherSearchQuery,
	setTeacherSearchQuery,
	filteredTeachers,
	teacherId,
	setTeacherId,
	formatTeacherName,
	isTeacherAvailable,
	error,
	setErrors,
	isOptional = false,
}) => {
	return (
		<div className='form-group'>
			<label>Teacher{isOptional ? ' (optional)' : '*'}</label>
			<input
				type='text'
				className='search-input'
				placeholder='Search teacher...'
				value={teacherSearchQuery}
				onChange={(e) => setTeacherSearchQuery(e.target.value)}
			/>

			{/* Display selected teacher */}
			{filteredTeachers.length > 0 && teacherId !== -1 && (
				<div className='search-results'>
					<p>
						Selected:{' '}
						<strong>
							{formatTeacherName(
								filteredTeachers.find((t) => t.id === teacherId) ||
									filteredTeachers[0],
							)}
						</strong>
						{!isTeacherAvailable(teacherId) && (
							<span className='availability-warning'>
								{' '}
								(not available at this time)
							</span>
						)}
					</p>
				</div>
			)}

			{/* Show message if no teachers found */}
			{filteredTeachers.length === 0 && teacherSearchQuery && (
				<div className='error-message'>
					No teachers found. Try a different search.
				</div>
			)}

			{error && <div className='error-message'>{error}</div>}

			{/* List of available teachers */}
			{filteredTeachers.length > 0 && (
				<div className='availability-list'>
					<p>Available teachers:</p>
					<ul>
						{filteredTeachers
							.filter((teacher) => isTeacherAvailable(teacher.id))
							.map((teacher) => (
								<li
									key={teacher.id}
									className='available-item'
									onClick={() => {
										setTeacherId(teacher.id);
										setTeacherSearchQuery(
											teacher.firstName + ' ' + teacher.lastName,
										);
										setErrors((prev) => ({ ...prev, teacher: undefined }));
									}}
								>
									{formatTeacherName(teacher)}
								</li>
							))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default TeacherSelector;
