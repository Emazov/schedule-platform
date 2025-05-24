import React from 'react';

type NewLessonFormProps = {
	title: string;
	setTitle: (title: string) => void;
	color: string;
	setColor: (color: string) => void;
	lessonColors: string[];
	titleError?: string;
};

/**
 * Component for creating a new lesson
 * Allows setting title and color for a new lesson
 */
const NewLessonForm: React.FC<NewLessonFormProps> = ({
	title,
	setTitle,
	color,
	setColor,
	lessonColors,
	titleError,
}) => {
	return (
		<>
			<div className='form-group'>
				<label>Lesson title*</label>
				<input
					type='text'
					className='form-control'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				{titleError && <div className='error-message'>{titleError}</div>}
			</div>

			<div className='form-group'>
				<label>Lesson color</label>
				<div className='color-picker'>
					{lessonColors.map((c) => (
						<div
							key={c}
							className={`color-option ${color === c ? 'selected' : ''}`}
							style={{ backgroundColor: c }}
							onClick={() => setColor(c)}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export default NewLessonForm;
