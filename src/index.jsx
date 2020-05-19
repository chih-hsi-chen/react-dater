import React from 'react';
import PropTypes from 'prop-types';
import cname from 'classnames';
import onClickOutside from 'react-onclickoutside';
import Calendar from './Calendar';
import PopperComponent from './PopperComponent';
import RDXContext from './helpers/ContextConfig';
import {
	parseDate,
	newDate,
	formatDate,
	setTime,
	getHours,
	getMinutes,
	isBefore,
	determineMinMax,
} from './helpers/date-utils';
import { PRESELECT, STARTSELECT, ENDSELECT } from './helpers/constant';
import './stylesheets/DatePicker.css';

const WrappedCalendar = onClickOutside(Calendar);

export { addLocale, registerDefaultLocale } from './helpers/date-utils';

export default class DatePicker extends React.Component {
	static propTypes = {
		customClassName: PropTypes.string,
		intervals: PropTypes.number,
		dateFormatCalendar: PropTypes.string,
		dateFormatInput: PropTypes.string,
		dateFormatTime: PropTypes.string,
		locale: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		disabled: PropTypes.bool,
		readOnly: PropTypes.bool,
		inputElement: PropTypes.element,
		onChange: PropTypes.func,
		selected: PropTypes.instanceOf(Date),
		showMonthYearSeparate: PropTypes.bool,
		selectTime: PropTypes.bool,
		selectDateRange: PropTypes.bool,
		selectTimeRange: PropTypes.bool,
		minDate: PropTypes.instanceOf(Date),
		maxDate: PropTypes.instanceOf(Date),
		startDate: PropTypes.instanceOf(Date),
		endDate: PropTypes.instanceOf(Date),
		skipOverflowCheck: PropTypes.bool,
	};

	static defaultProps = {
		dateFormatCalendar: 'LLL yyyy',
		dateFormatInput: 'MM/dd/yyyy',
		dateFormatTime: 'HH:mm',
		onChange: () => {},
		skipOverflowCheck: false,
	};

	constructor(props) {
		super(props);

		this.state = this.getInitialState();
		this.inputTimeout = null;
	}

	getInitialState = () => {
		const {
			minDate,
			maxDate,
			selectDateRange,
			selected,
			startDate,
			endDate,
		} = this.props;
		let initialDateToSee = selected || newDate();
		const initialDateStart = startDate || null;
		const initialDateEnd = endDate || null;

		if (selectDateRange) {
			initialDateToSee =
				initialDateStart || initialDateEnd || initialDateToSee;
		}

		if (!this.props.skipOverflowCheck) {
			if (minDate && isBefore(initialDateToSee, minDate)) {
				initialDateToSee = minDate;
			} else if (maxDate && isBefore(maxDate, initialDateToSee)) {
				initialDateToSee = maxDate;
			}
		}

		return {
			open: false,
			inputValue: null,
			focused: false,
			selectState: initialDateStart
				? STARTSELECT
				: initialDateEnd
				? ENDSELECT
				: PRESELECT, // for date range
			selectedDate: initialDateToSee,
			viewDate: initialDateToSee,
			selectedDateStart: initialDateStart,
			selectedDateEnd: initialDateEnd,
			hoveringDate: null,
		};
	};

	getResetView = () => {
		if (this.props.selectDateRange) {
			const { selectedDateStart, selectedDateEnd, viewDate } = this.state;
			return selectedDateStart || selectedDateEnd || viewDate;
		}
		return this.state.selectedDate;
	};

	clearTimer = () => {
		if (typeof this.inputTimeout === 'number') {
			window.clearTimeout(this.inputTimeout);
			this.inputTimeout = null;
		}
	};

	isCalendarOpen = () => {
		return this.state.open && !this.props.disabled && !this.props.readOnly;
	};

	/**
	 * @param {Boolean} nextOpenState - next calendar popper open state
	 * @param {Boolean} isResetView - if true, represent there is no selection happend or range select is interrupted
	 */
	setOpen = (nextOpenState, isResetView, resetViewDate) => {
		this.setState((prevState) => {
			const BaseUpdate = {
				open: nextOpenState,
			};
			if (isResetView)
				return {
					...BaseUpdate,
					viewDate: resetViewDate,
				};
			return BaseUpdate;
		});
	};

	/**
	 * @description update selected date and view date in calendar
	 * @param {Date} date - selected date from calendar or input field
	 * @param {Boolean} keepInput - if false, just set inputValue as null to represent the update is from calendar
	 *
	 */
	setSelected = (date, event, keepInput) => {
		const { selectedDate: selected } = this.state;
		let changedDate = date;

		if (!this.props.selectTime || !keepInput) {
			changedDate = setTime(changedDate, {
				hour: getHours(selected),
				min: getMinutes(selected),
			});
		}
		this.setState({
			selectedDate: changedDate,
			viewDate: changedDate,
		});
		if (!keepInput) this.setState({ inputValue: null });

		// call the callback function which is from parent element
		this.props.onChange(changedDate, event);
	};

	setRangeSelected = ({ start, end } = {}, event, keepInput) => {
		const nextUpdate = {
			selectState: PRESELECT,
			selectedDateStart: start || this.state.selectedDateStart,
			selectedDateEnd: end || this.state.selectedDateEnd,
		};

		if (keepInput) {
			if (start && end) {
				[
					nextUpdate.selectedDateStart,
					nextUpdate.selectedDateEnd,
				] = determineMinMax(start, end);
				nextUpdate.inputValue = null;
			}
		} else {
			nextUpdate.inputValue = null;
			if (this.state.selectState === PRESELECT) {
				nextUpdate.selectState = STARTSELECT;
				if (this.state.selectedDateStart !== null)
					nextUpdate.selectedDateEnd = null;
			} else {
				[
					nextUpdate.selectedDateStart,
					nextUpdate.selectedDateEnd,
				] = determineMinMax(
					nextUpdate.selectedDateStart,
					nextUpdate.selectedDateEnd
				);
				nextUpdate.viewDate = nextUpdate.selectedDateStart;
			}
		}
		if (nextUpdate.selectState === PRESELECT) {
			nextUpdate.hoveringDate = null;
		}
		this.setState(nextUpdate);
	};

	setViewDate = (date) => {
		this.setState({
			viewDate: date,
		});
	};

	handleInputClick = () => {
		if (!this.props.disabled && !this.props.readOnly) this.setOpen(true);
	};

	handleFocus = (e) => {
		// if (!this.state.open) this.setOpen(true);
		// this.setState({
		// 	focused: true
		// });
	};

	handleBlur = () => {
		// this.setState({ focused: false });
	};

	inputChangeCallBack = (event) => {
		const { dateFormatInput, locale } = this.props;
		const targetVal = event.target.value;
		let parsedDate;

		if (this.props.selectDateRange) {
			const [start, end] = targetVal.split('to').map((d) => d.trim());
			const parsedStart = parseDate(start, dateFormatInput, locale);
			const parsedEnd = parseDate(end, dateFormatInput, locale);

			this.setRangeSelected(
				{ start: parsedStart, end: parsedEnd },
				event,
				true
			);
		} else {
			parsedDate = parseDate(targetVal, dateFormatInput, locale);
			if (parsedDate) this.setSelected(parsedDate, event, true);
		}
	};

	// text input change
	handleInputChange = (...args) => {
		const event = args[0].nativeEvent;

		this.clearTimer();
		this.inputTimeout = window.setTimeout(
			this.inputChangeCallBack,
			2000,
			event
		);

		this.setState({
			inputValue: event.target.value,
		});
	};

	handleSelect = (date, event) => {
		const { selectState } = this.state;
		const { selectDateRange } = this.props;

		this.clearTimer();

		if (selectDateRange) {
			switch (selectState) {
				case PRESELECT:
					this.setRangeSelected({ start: date }, event, false);
					break;
				case STARTSELECT:
					this.setOpen(false, false);
					this.setRangeSelected({ end: date }, event, false);
					break;
				case ENDSELECT:
					this.setOpen(false, false);
					this.setRangeSelected({ start: date }, event, false);
					break;
				default:
					break;
			}
		} else {
			this.setOpen(false, false);
			this.setSelected(date, event, false);
		}
	};

	handleDayHover = (day) => {
		if (this.state.selectState !== PRESELECT)
			this.setState({ hoveringDate: day });
	};

	handleTimeSelect = (time) => {
		const { selectedDate: selected } = this.state;

		const changedDate = setTime(selected, {
			hour: getHours(time),
			min: getMinutes(time),
		});

		this.setState({
			selectedDate: changedDate,
			inputValue: null,
		});
	};

	handleCalendarClickOutside = (e) => {
		if (e.target !== this.input) {
			let resetViewDate;
			if (this.props.selectDateRange) {
				const {
					selectedDateStart,
					selectedDateEnd,
					viewDate,
				} = this.state;
				resetViewDate =
					selectedDateStart || selectedDateEnd || viewDate;
			} else resetViewDate = this.state.selectedDate;
			this.setOpen(false, true, resetViewDate);
		}
	};

	getDateRangeFormat = () => {
		const { dateFormatInput, locale } = this.props;
		const { selectedDateStart, selectedDateEnd } = this.state;
		const startStr =
			formatDate(selectedDateStart, dateFormatInput, locale) || '...';
		const endStr =
			formatDate(selectedDateEnd, dateFormatInput, locale) || '...';

		return `${startStr} to ${endStr}`;
	};

	renderCalendar = () => {
		return (
			<WrappedCalendar
				intervals={this.props.intervals}
				dateFormat={this.props.dateFormatCalendar}
				onClickOutside={this.handleCalendarClickOutside}
				selected={this.state.selectedDate}
				viewed={this.state.viewDate}
				onChangeView={this.setViewDate}
				showMonthYearSeparate={this.props.showMonthYearSeparate}
				selectTime={this.props.selectTime} // for single time select
				selectDateRange={this.props.selectDateRange} // for multiple day select
				selectTimeRange={this.props.selectTimeRange} // for multiple time select
				minDate={this.props.minDate}
				maxDate={this.props.maxDate}
			/>
		);
	};

	renderDateInput = () => {
		const InputElemToRender = this.props.inputElement || (
			<input type='text' />
		);
		const inputValue =
			typeof this.state.inputValue === 'string'
				? this.state.inputValue
				: this.props.selectDateRange
				? this.getDateRangeFormat()
				: formatDate(
						this.state.selectedDate,
						this.props.dateFormatInput,
						this.props.locale
				  );

		const InputClassName = cname(
			'rdx__textInput',
			this.props.customClassName,
			InputElemToRender.props.className
		);

		return React.cloneElement(InputElemToRender, {
			ref: (input) => (this.input = input),
			value: inputValue,
			onChange: this.handleInputChange,
			onFocus: this.handleFocus,
			onBlur: this.handleBlur,
			onClick: this.handleInputClick,
			placeholder: this.props.placeholderText,
			readOnly: this.props.readOnly,
			disabled: this.props.disabled,
			className: InputClassName,
		});
	};

	render() {
		const calendar = this.renderCalendar();
		const {
			selectedDate,
			selectedDateStart,
			selectedDateEnd,
			viewDate,
			hoveringDate,
		} = this.state;

		return (
			<RDXContext.Provider
				value={{
					selectDateRange: this.props.selectDateRange,
					locale: this.props.locale,
					selected: selectedDate,
					viewed: viewDate,
					hoveringDate: hoveringDate,
					startDate: selectedDateStart,
					endDate: selectedDateEnd,
					minDate: this.props.minDate,
					onDaySelect: this.handleSelect,
					onDayHover: this.handleDayHover,
					onTimeSelect: this.handleTimeSelect,
				}}
			>
				<PopperComponent
					hidePopper={!this.isCalendarOpen()}
					popperComponent={calendar}
					targetComponent={
						<div className='rdx__input-container'>
							{this.renderDateInput()}
						</div>
					}
				/>
			</RDXContext.Provider>
		);
	}
}
