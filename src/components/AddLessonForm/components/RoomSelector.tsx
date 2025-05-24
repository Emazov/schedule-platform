import React from 'react';
import type { Room } from '@/types/types';

type RoomSelectorProps = {
	roomSearchQuery: string;
	setRoomSearchQuery: (query: string) => void;
	filteredRooms: Room[];
	roomId: number;
	setRoomId: (id: number) => void;
	isRoomAvailable: (roomId: number) => boolean;
	error?: string;
	setErrors: (prev: any) => void;
	isOptional?: boolean;
};

/**
 * Component for selecting a room
 * Shows search, selected room, and list of available rooms
 */
const RoomSelector: React.FC<RoomSelectorProps> = ({
	roomSearchQuery,
	setRoomSearchQuery,
	filteredRooms,
	roomId,
	setRoomId,
	isRoomAvailable,
	error,
	setErrors,
	isOptional = false,
}) => {
	return (
		<div className='form-group'>
			<label>Room{isOptional ? ' (optional)' : '*'}</label>
			<input
				type='text'
				className='search-input'
				placeholder='Search room...'
				value={roomSearchQuery}
				onChange={(e) => setRoomSearchQuery(e.target.value)}
			/>

			{/* Display selected room */}
			{filteredRooms.length > 0 && roomId !== -1 && (
				<div className='search-results'>
					<p>
						Selected:{' '}
						<strong>
							{filteredRooms.find((r) => r.id === roomId)?.code ||
								filteredRooms[0].code}
						</strong>
						{!isRoomAvailable(roomId) && (
							<span className='availability-warning'>
								{' '}
								(not available at this time)
							</span>
						)}
					</p>
				</div>
			)}

			{/* Show message if no rooms found */}
			{filteredRooms.length === 0 && roomSearchQuery && (
				<div className='error-message'>
					No rooms found. Try a different search.
				</div>
			)}

			{error && <div className='error-message'>{error}</div>}

			{/* List of available rooms */}
			{filteredRooms.length > 0 && (
				<div className='availability-list'>
					<p>Available rooms:</p>
					<ul>
						{filteredRooms
							.filter((room) => isRoomAvailable(room.id))
							.map((room) => (
								<li
									key={room.id}
									className='available-item'
									onClick={() => {
										setRoomId(room.id);
										setRoomSearchQuery(room.code);
										setErrors((prev: any) => ({ ...prev, room: undefined }));
									}}
								>
									{room.code}
								</li>
							))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default RoomSelector;
