import React from 'react';
import type { Block } from '@/types/types';

type BlockSelectorProps = {
	blockSearchQuery: string;
	setBlockSearchQuery: (query: string) => void;
	filteredBlocks: Block[];
	blockId: number;
	setBlockId: (id: number) => void;
	setRoomSearchQuery: (query: string) => void;
	error?: string;
};

/**
 * Component for selecting a block
 * Shows search, selected block, and list of available blocks
 */
const BlockSelector: React.FC<BlockSelectorProps> = ({
	blockSearchQuery,
	setBlockSearchQuery,
	filteredBlocks,
	blockId,
	setBlockId,
	setRoomSearchQuery,
	error,
}) => {
	return (
		<div className='form-group'>
			<label>Block*</label>
			<input
				type='text'
				className='search-input'
				placeholder='Search block...'
				value={blockSearchQuery}
				onChange={(e) => setBlockSearchQuery(e.target.value)}
			/>

			{/* Display selected block */}
			{filteredBlocks.length > 0 && blockId !== -1 && (
				<div className='search-results'>
					<p>
						Selected:{' '}
						<strong>
							{filteredBlocks.find((b) => b.id === blockId)?.code ||
								filteredBlocks[0].code}
						</strong>
					</p>
				</div>
			)}

			{/* Show message if no blocks found */}
			{filteredBlocks.length === 0 && blockSearchQuery && (
				<div className='error-message'>
					No blocks found. Try a different search.
				</div>
			)}

			{error && <div className='error-message'>{error}</div>}

			{/* List of available blocks */}
			{filteredBlocks.length > 0 && (
				<div className='availability-list'>
					<p>Available blocks:</p>
					<ul>
						{filteredBlocks.map((block) => (
							<li
								key={block.id}
								className='available-item'
								onClick={() => {
									setBlockId(block.id);
									setBlockSearchQuery(block.code);
									// Сбрасываем поиск комнаты при выборе нового блока
									setRoomSearchQuery('');
								}}
							>
								{block.code}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default BlockSelector;
