import React from 'react';
import PropTypes from 'prop-types';
import Week from './Week';
import {
	getFirstWeekDay,
	getFirstMonthDay,
	addWeeks,
	isSameMonth,
} from './helpers/date-utils';

// basically, show 6 weeks in month
const FIXED_HEIGHT_WEEK_COUNT = 6;

const renderWeeks = ({ day }) => {
	const weeks = [];
	let i;
	let currentWeekStart = getFirstWeekDay(getFirstMonthDay(day));

	for (i = 0; i < FIXED_HEIGHT_WEEK_COUNT - 1; i++) {
		weeks.push(
			<Week weekNumber={i} key={`rdx-week-${i}`} day={currentWeekStart} />
		);

		currentWeekStart = addWeeks(currentWeekStart, 1);
	}

	if (isSameMonth(currentWeekStart, day)) {
		weeks.push(
			<Week weekNumber={i} key={`rdx-week-${i}`} day={currentWeekStart} />
		);
	}

	return weeks;
};

const Month = (props) => {
	return <div className='rdx__month'>{renderWeeks(props)}</div>;
};

Month.propTypes = {
	day: PropTypes.instanceOf(Date).isRequired,
};

export default React.memo(Month, (prevProps, nextProps) => {
	if (isSameMonth(prevProps.day, nextProps.day)) return true;
	return false;
});
