import useStockStore from '@store/useStockStore';

const MainTableHeader = () => {
	// Получаем данные напрямую из хранилищ
	const { timeSlots } = useStockStore();

	// Если данные ещё не загружены, не рендерим ничего
	if (timeSlots.length === 0) {
		return null;
	}

	return (
		<>
			{timeSlots.map((time) => (
				<div key={time.slot} className='main_table__header'>
					{time.slot} Hour <br /> {time.start}-{time.end}
				</div>
			))}
		</>
	);
};

export default MainTableHeader;
