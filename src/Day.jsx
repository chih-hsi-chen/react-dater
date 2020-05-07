import React from 'react';
import PropTypes from 'prop-types';
import { getDate, checkEqual, isSameMonth } from './helpers/date-utils';
import { RDXContext } from './helpers/ContextConfig';
import cname from 'classnames';

const Day = (props) => {
	const { day, selected, viewed, onDaySelect } = props;

	const handleClick = (event) => {
		onDaySelect(day, event);
	};
	const getClassNames = () => {
		return cname('rdx__day', {
			'rdx__day--selected': checkEqual(day, selected),
			'rdx__day--out-month': !isSameMonth(day, viewed)
		});
	};

	return (
		<div className={getClassNames()} onClick={handleClick}>
			{getDate(day)}
		</div>
	);
};

Day.propTypes = {
	day: PropTypes.instanceOf(Date),
	selected: PropTypes.instanceOf(Date),
	onDaySelect: PropTypes.func
};

export default (props) => (
	<RDXContext.Consumer>
		{({ selected, viewed, onDaySelect }) => (
			<Day
				{...props}
				selected={selected}
				viewed={viewed}
				onDaySelect={onDaySelect}
			/>
		)}
	</RDXContext.Consumer>
);
