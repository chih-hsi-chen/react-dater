import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CalendarContainer from "./CalendarContainer";
import cname from 'classnames';
import Month from './Month';
import {
	newDate,
	formatDate,
	addDays,
	getFirstWeekDay,
	getWeekdayNameInLocale,
	addMonths,
	subMonths,
	checkEqual,
} from '../helpers/date-utils';

class Calendar extends Component {
	static propTypes = {
		dateFormat: PropTypes.string.isRequired,
		selected: PropTypes.instanceOf(Date),
		viewed: PropTypes.instanceOf(Date),
	};

	constructor(props) {
		super(props);

		this.state = {
			date: this.getDateInView(),
		};
		this.containerRef = React.createRef();
	}

	componentDidUpdate(prevProps) {
		if(this.props.selected && !checkEqual(prevProps.selected, this.props.selected))
			this.setState({
				date: this.props.selected,
			});
	}

	// handle click-outside event, prepared for 'react-onclickoutside' module
	handleClickOutside = (e) => {
		this.props.onClickOutside(e);
	}

	getDateInView = () => {
		const { selected, viewed } = this.props;
		const initialDate = selected || viewed;

		if(initialDate)
			return initialDate;

		return newDate();
	}

	decreaseMonth = () => {
		this.props.onChangeView(
			subMonths(this.props.viewed, 1)
		);
	}

	increaseMonth = () => {
		this.props.onChangeView(
			addMonths(this.props.viewed, 1)
		);
	}

	renderCurrentMonth = (date = this.state.date) => {
		return (
			<div className={cname('rdx__current-month')}>
				{formatDate(date, this.props.dateFormat)}
			</div>
		);
	}
	renderWeekdayHeader = (date = this.state.date) => {
		const startDay_of_week = getFirstWeekDay(date);
		const weekdayNames = [];

		return weekdayNames.concat(
			[0, 1, 2, 3, 4, 5, 6].map(offset => {
				const day = addDays(startDay_of_week, offset);
				const weekdayName = getWeekdayNameInLocale(day);

				return (
					<div
						key={offset}
						className={cname('rdx__weekday-name')}
					>
						{weekdayName}
					</div>
				);
			})
		);
	}
	renderHeader = ({ monthDate }) => {
		return (
			<div className='rdx__header'>
				{this.renderCurrentMonth(monthDate)}
				<div className="rdx__weekdayname-header">
					{this.renderWeekdayHeader(monthDate)}
				</div>
			</div>
		);
	}
	renderMonths = () => {
		const monthDate = this.props.viewed;
		const monthKey = `month-${0}`;

		return (
			<div
				className="rdx__month-container"
				key={monthKey}
			>
				{this.renderHeader({ monthDate })}
				<Month
					day={monthDate}
				/>
			</div>
		);
	}

	renderPreviousButton = () => {
		return (
			<button
				type='button'
				className={cname('rdx__navigation', 'rdx__navigation--previousMonth')}
				aria-label='Previous Month'
				onClick = {this.decreaseMonth}
			>
				{'Previous Month'}
			</button>
		);
	}
	renderNextButton = () => {
		return (
			<button
				type='button'
				className={cname('rdx__navigation', 'rdx__navigation--nextMonth')}
				aria-label='Next Month'
				onClick = {this.increaseMonth}
			>
				{'Next Month'}
			</button>
		);
	}

	render() {
		return (
			<div ref = {this.containerRef}>
				<CalendarContainer
					className={cname("rdx")}
				>
					{this.renderPreviousButton()}
					{this.renderNextButton()}
					{this.renderMonths()}
					{this.props.children}
				</CalendarContainer>
			</div>
		);
	}
}

export default Calendar;