type EmptyCellProps = {
	timeId: number;
	groupId: number;
};

const EmptyCell = ({ timeId, groupId }: EmptyCellProps) => {
	return (
		<div
			id={timeId.toString()}
			data-group={groupId}
			className='main_table__cell'
		/>
	);
};

export default EmptyCell;
