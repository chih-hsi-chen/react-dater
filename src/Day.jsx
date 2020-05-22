import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
	getDate,
	checkEqual,
	isSameMonth,
	isDayInRange,
} from './helpers/date-utils';
import RDXContext, { connect } from './helpers/ContextConfig';
import cname from 'classnames';

function useSelect() {
	const {
		minDate,
		selected,
		viewed,
		hoveringDate,
		onDaySelect,
		onDayHover,
		startDate,
		endDate,
		selectDateRange,
	} = useContext(RDXContext);

	return {
		minDate,
		selected,
		viewed,
		hoveringDate,
		onDaySelect,
		onDayHover,
		startDate,
		endDate,
		selectDateRange,
	};
}

const Day = React.memo((props) => {
	const {
		day,
		selected,
		viewed,
		hoveringDate,
		onDaySelect,
		onDayHover,
		startDate,
		endDate,
		selectDateRange,
	} = props;

	const handleClick = (event) => {
		onDaySelect(day, event);
	};
	function isSelected() {
		if (!selectDateRange) return checkEqual(day, selected);
		return false;
	}
	function isRangeStart() {
		if (!startDate) return false;
		return checkEqual(startDate, day);
	}
	function isRangeEnd() {
		if (!endDate) return false;
		return checkEqual(endDate, day);
	}
	function isInRange() {
		if (hoveringDate) {
			if (startDate && !endDate) {
				return isDayInRange(day, hoveringDate, startDate);
			}
			if (!startDate && endDate) {
				return isDayInRange(day, hoveringDate, endDate);
			}
		} else {
			if (startDate && endDate)
				return isDayInRange(day, startDate, endDate);
		}

		return false;
	}
	function handleMouseEnter() {
		onDayHover(day);
	}

	const getClassNames = () => {
		return cname('rdx__day', {
			'rdx__day--selected': isSelected(),
			'rdx__day--range-start': isRangeStart(),
			'rdx__day--range-end': isRangeEnd(),
			'rdx__day--in-range': isInRange(),
			'rdx__day--out-month': !isSameMonth(day, viewed),
		});
	};

	return (
		<div
			className={getClassNames()}
			onClick={handleClick}
			onMouseEnter={handleMouseEnter}
		>
			{getDate(day)}
		</div>
	);
});

Day.propTypes = {
	day: PropTypes.instanceOf(Date),
	viewed: PropTypes.instanceOf(Date),
	selected: PropTypes.instanceOf(Date),
	onDaySelect: PropTypes.func,
};

export default connect(Day, useSelect);
