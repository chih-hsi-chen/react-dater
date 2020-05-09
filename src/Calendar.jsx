import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CalendarContainer from './CalendarContainer';
import cname from 'classnames';
import Month from './Month';
import Time from './Time';
import {
	newDate,
	formatDate,
	addDays,
	addMonths,
	addYears,
	subMonths,
	subYears,
	getFirstWeekDay,
	getWeekdayNameInLocale,
} from './helpers/date-utils';
import { CalendarToday, AccessTime } from '@material-ui/icons';
import { RDXContext } from './helpers/ContextConfig';

class Calendar extends Component {
	static propTypes = {
		dateFormat: PropTypes.string.isRequired,
		selected: PropTypes.instanceOf(Date),
		viewed: PropTypes.instanceOf(Date),
		showMonthYearSeparate: PropTypes.bool,
		selectTime: PropTypes.bool,
		selectDateRange: PropTypes.bool,
		selectTimeRange: PropTypes.bool,
	};

	constructor(props) {
		super(props);

		this.state = {
			// date: this.getDateInView(),
			timeCollapse: true,
		};
		this.containerRef = React.createRef();
	}

	// handle click-outside event, prepared for 'react-onclickoutside' module
	handleClickOutside = (e) => {
		this.setState({
			timeCollapse: true,
		});
		this.props.onClickOutside(e);
	};

	getDateInView = () => {
		const { selected, viewed } = this.props;
		const initialDate = viewed || selected;

		if (initialDate) return initialDate;

		return newDate();
	};

	decreaseMonth = () => {
		this.props.onChangeView(subMonths(this.props.viewed, 1));
	};

	increaseMonth = () => {
		this.props.onChangeView(addMonths(this.props.viewed, 1));
	};

	decreaseYear = () => {
		this.props.onChangeView(subYears(this.props.viewed, 1));
	};

	increaseYear = () => {
		this.props.onChangeView(addYears(this.props.viewed, 1));
	};

	renderCurrentMonthYear = (date = this.getDateInView()) => {
		const { locale } = this.context;

		return (
			<div className={cname('rdx__current-headerInfo')}>
				{this.renderPreviousButton()}
				{this.renderNextButton()}
				{formatDate(date, this.props.dateFormat, locale)}
			</div>
		);
	};

	renderCurrentMonthYearSparate = (date = this.getDateInView()) => {
		const { locale } = this.context;

		return (
			<div className={cname('rdx__current-headerInfo')}>
				<div className='rdx__month-info'>
					{this.renderPreviousButton('MONTH')}
					{this.renderNextButton('MONTH')}
					{formatDate(date, 'LLL', locale)}
				</div>
				<div className='rdx__year-info'>
					{this.renderPreviousButton('YEAR')}
					{this.renderNextButton('YEAR')}
					{formatDate(date, 'yyyy', locale)}
				</div>
			</div>
		);
	};

	renderWeekdayHeader = (date = this.getDateInView()) => {
		const { locale } = this.context;
		const startDayOfWeek = getFirstWeekDay(date, locale);
		let weekdayNames = [];

		weekdayNames = weekdayNames.concat(
			[0, 1, 2, 3, 4, 5, 6].map((offset) => {
				const day = addDays(startDayOfWeek, offset);
				const weekdayName = getWeekdayNameInLocale(day, locale);

				return (
					<div key={offset} className={cname('rdx__weekday-name')}>
						{weekdayName}
					</div>
				);
			})
		);

		return <div className='rdx__weekdayname-header'>{weekdayNames}</div>;
	};

	renderDefaultHeader = ({ monthDate }) => {
		return (
			<div className='rdx__header rdx__header--default'>
				{this.renderCurrentMonthYear(monthDate)}
				{this.renderWeekdayHeader(monthDate)}
			</div>
		);
	};

	renderSeparateMonthYearHeader = ({ monthDate }) => {
		return (
			<div className='rdx__header rdx__header--separate'>
				{this.renderCurrentMonthYearSparate(monthDate)}
				{this.renderWeekdayHeader(monthDate)}
			</div>
		);
	};

	renderHeader = ({ monthDate }) => {
		if (this.props.showMonthYearSeparate)
			return this.renderSeparateMonthYearHeader({ monthDate });

		return this.renderDefaultHeader({ monthDate });
	};

	renderMonths = () => {
		const monthDate = this.getDateInView();
		const monthKey = `month-${0}`;

		return (
			<div className='rdx__month-container' key={monthKey}>
				{this.renderHeader({ monthDate })}
				<Month day={monthDate} />
			</div>
		);
	};

	renderPreviousButton = (handlerType = 'MONTH') => {
		const Label = `NEXT ${handlerType}`;
		let clickHandler;

		switch (handlerType) {
			case 'MONTH':
				clickHandler = this.decreaseMonth;
				break;
			case 'YEAR':
				clickHandler = this.decreaseYear;
				break;
			default:
				clickHandler = () => {};
				break;
		}

		return (
			<button
				type='button'
				className={cname(
					'rdx__navigation',
					'rdx__navigation--previousMonth'
				)}
				aria-label={Label}
				onClick={clickHandler}
			>
				{`PREVIOUS ${handlerType}`}
			</button>
		);
	};

	renderNextButton = (handlerType = 'MONTH') => {
		const Label = `NEXT ${handlerType}`;
		let clickHandler;

		switch (handlerType) {
			case 'MONTH':
				clickHandler = this.increaseMonth;
				break;
			case 'YEAR':
				clickHandler = this.increaseYear;
				break;
			default:
				clickHandler = () => {};
				break;
		}

		return (
			<button
				type='button'
				className={cname(
					'rdx__navigation',
					'rdx__navigation--nextMonth'
				)}
				aria-label={Label}
				onClick={clickHandler}
			>
				{Label}
			</button>
		);
	};

	renderFooter = () => {
		const { timeCollapse } = this.state;
		const classes = {
			root: 'rdx__timeToggleIcon',
		};

		return (
			<div
				className='rdx__time-footer'
				data-collapse={this.state.timeCollapse}
			>
				<div
					className='rdx__timeToggleWrapper'
					onClick={() =>
						this.setState((prevState) => ({
							timeCollapse: !prevState.timeCollapse,
						}))
					}
				>
					{timeCollapse ? (
						<AccessTime classes={classes} />
					) : (
						<CalendarToday classes={classes} />
					)}
				</div>
				<div className='rdx__timeDisplayWrapper'>
					<Time />
				</div>
			</div>
		);
	};

	render() {
		return (
			<div ref={this.containerRef}>
				<CalendarContainer
					className={cname('rdx', {
						'rdx--select-time': this.props.selectTime,
					})}
				>
					{this.renderMonths()}
					{this.props.children}
					{this.props.selectTime && this.renderFooter()}
				</CalendarContainer>
			</div>
		);
	}
}
Calendar.contextType = RDXContext;

export default Calendar;
