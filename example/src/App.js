import React from 'react'
import DatePicker from 'react-dater';
import 'react-dater/dist/index.css';

const MyInput = React.forwardRef((props, ref) => {

	return (
		<div>
			<input
				type='text'
				ref={ref}
				{...props}
			/>
		</div>
	);
});

const App = () => {
	return (
		<DatePicker
			dateFormatCalendar='LLL yyyy'
			inputElement={<MyInput />}
			placeholderText='select a date'
		/>
	)
}

export default App
