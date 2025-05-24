import React from 'react';
import type { Event } from '@/types/types';

type EventSelectorProps = {
	eventSearchQuery: string;
	setEventSearchQuery: (query: string) => void;
	filteredEvents: Event[];
	eventId: number;
	isNewEvent: boolean;
	title: string;
	setIsNewEvent: (isNew: boolean) => void;
	setEventId: (id: number) => void;
	setTitle: (title: string) => void;
	setColor: (color: string) => void;
	error?: string;
};

/**
 * Component for selecting or creating an event
 * Handles searching, selecting existing events, or creating a new one
 */
const EventSelector: React.FC<EventSelectorProps> = ({
	eventSearchQuery,
	setEventSearchQuery,
	filteredEvents,
	eventId,
	isNewEvent,
	title,
	setIsNewEvent,
	setEventId,
	setTitle,
	setColor,
	error,
}) => {
	return (
		<div className='form-group'>
			<label>Search for an event</label>
			<input
				type='text'
				className='search-input'
				placeholder='Type event name...'
				value={eventSearchQuery}
				onChange={(e) => setEventSearchQuery(e.target.value)}
			/>

			{/* Show selected event info when an existing event is selected */}
			{filteredEvents.length > 0 && !isNewEvent && (
				<div className='search-results'>
					<p>
						Selected:{' '}
						<strong>
							{filteredEvents.find((e) => e.id === eventId)?.title ||
								'Create new event'}
						</strong>
					</p>
					<button
						type='button'
						className='btn btn-secondary btn-sm'
						onClick={() => {
							setIsNewEvent(true);
							setTitle(eventSearchQuery);
						}}
					>
						Create new instead
					</button>
				</div>
			)}

			{/* Show info when creating a new event */}
			{isNewEvent && (
				<div className='search-results'>
					<p>
						Creating new event: <strong>{title}</strong>
					</p>
					{filteredEvents.length > 0 && (
						<button
							type='button'
							className='btn btn-secondary btn-sm'
							onClick={() => {
								setIsNewEvent(false);
								setEventId(filteredEvents[0].id);
								setTitle(filteredEvents[0].title);
								setColor(filteredEvents[0].color);
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

export default EventSelector;
