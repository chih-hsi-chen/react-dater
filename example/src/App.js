import React from 'react';
import { subMonths, addMonths } from 'date-fns';

import DatePicker from 'react-dater';
import 'react-dater/dist/index.css';

const App = () => {
	return (
		<>
			<DatePicker
				showMonthYearSeparate
				selectDateRange
				endDate={new Date('2020/03/02')}
			/>
		</>
		
	);
};

export default App;
