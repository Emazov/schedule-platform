import React, { useState } from 'react';

import './index.css';

const SidePanel = () => {
	const [newLessonTitle, setNewLessonTitle] = useState('');
	const [isDuplicate, setIsDuplicate] = useState(false);

	const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newLessonTitle.trim()) return;
	};

	return (
		<div className='side_panel'>
			<h4>Available lessons</h4>
			<form onSubmit={handleAddTask} className='side_form'>
				<input
					type='text'
					value={newLessonTitle}
					onChange={(e) => {
						setNewLessonTitle(e.target.value);
						setIsDuplicate(false);
					}}
					className='side_input'
					placeholder='New lesson'
				/>
				<button type='submit' className='side_btn'>
					Add
				</button>
			</form>
			{isDuplicate && (
				<div className='side_duplicate'>Lesson already exists</div>
			)}
			<div className='side_lessons_list'></div>
		</div>
	);
};

export default SidePanel;
