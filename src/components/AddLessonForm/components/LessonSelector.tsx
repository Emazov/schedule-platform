import React from 'react';
import type { Lesson } from '@/types/types';

type LessonSelectorProps = {
	lessonSearchQuery: string;
	setLessonSearchQuery: (query: string) => void;
	filteredLessons: Lesson[];
	lessonId: number;
	isNewLesson: boolean;
	title: string;
	setIsNewLesson: (isNew: boolean) => void;
	setLessonId: (id: number) => void;
	setTitle: (title: string) => void;
	setColor: (color: string) => void;
	error?: string;
};

/**
 * Component for selecting or creating a lesson
 * Handles searching, selecting existing lessons, or creating a new one
 */
const LessonSelector: React.FC<LessonSelectorProps> = ({
	lessonSearchQuery,
	setLessonSearchQuery,
	filteredLessons,
	lessonId,
	isNewLesson,
	title,
	setIsNewLesson,
	setLessonId,
	setTitle,
	setColor,
	error,
}) => {
	return (
		<div className='form-group'>
			<label>Search for a lesson</label>
			<input
				type='text'
				className='search-input'
				placeholder='Type lesson name...'
				value={lessonSearchQuery}
				onChange={(e) => setLessonSearchQuery(e.target.value)}
			/>

			{/* Show selected lesson info when an existing lesson is selected */}
			{filteredLessons.length > 0 && !isNewLesson && (
				<div className='search-results'>
					<p>
						Selected:{' '}
						<strong>
							{filteredLessons.find((l) => l.id === lessonId)?.title ||
								'Create new lesson'}
						</strong>
					</p>
					<button
						type='button'
						className='btn btn-secondary btn-sm'
						onClick={() => {
							setIsNewLesson(true);
							setTitle(lessonSearchQuery);
						}}
					>
						Create new instead
					</button>
				</div>
			)}

			{/* Show info when creating a new lesson */}
			{isNewLesson && (
				<div className='search-results'>
					<p>
						Creating new lesson: <strong>{title}</strong>
					</p>
					{filteredLessons.length > 0 && (
						<button
							type='button'
							className='btn btn-secondary btn-sm'
							onClick={() => {
								setIsNewLesson(false);
								setLessonId(filteredLessons[0].id);
								setTitle(filteredLessons[0].title);
								setColor(filteredLessons[0].color);
							}}
						>
							Use existing instead
						</button>
					)}
				</div>
			)}

			{error && <div className='error-message'>{error}</div>}
		</div>
	);
};

export default LessonSelector;
