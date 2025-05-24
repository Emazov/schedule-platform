import { create } from 'zustand';
import type { Block } from '@/types/types';

type BlocksStore = {
	blocks: Block[];
	addBlock: (block: Block) => void;
	setBlocks: (blocks: Block[]) => void;
};

// Sample data for blocks
const initialBlocks: Block[] = [
	{ id: 1, code: 'A' },
	{ id: 2, code: 'B' },
	{ id: 3, code: 'C' },
	{ id: 4, code: 'D' },
];

const useBlocksStore = create<BlocksStore>((set) => ({
	blocks: initialBlocks,
	addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
	setBlocks: (blocks) => set({ blocks }),
}));

export default useBlocksStore;
