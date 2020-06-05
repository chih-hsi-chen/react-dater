import {
	format,
	startOfDay,
	startOfWeek,
	startOfMonth,
	addDays,
	addWeeks,
	addMonths,
	addYears,
	subMonths,
	subYears,
	setHours,
	setMinutes,
	parse,
	parseISO,
	toDate,
	isValid,
	getHours,
	getMinutes,
	getDate,
	isSameDay,
	isSameMonth,
	isBefore,
	differenceInCalendarYears,
	differenceInCalendarMonths,
	differenceInCalendarDays,
	isWithinInterval,
	endOfDay,
} from 'date-fns';

import { enUS } from 'date-fns/locale';

const getScope = () => {
	return typeof window !== 'undefined' ? window : global;
};

export const newDate = (initialValue) => {
	const date = initialValue
		? typeof initialValue === 'string' || initialValue instanceof String
			? parseISO(initialValue)
			: toDate(initialValue)
		: new Date();

	return isValid(date) ? date : new Date();
};

export const formatDate = (date, formatStr = 'yyyy-MM-dd', locale) => {
	const LocaleObj = getLocaleObject(locale);

	if (!isValid(date)) return null;

	return format(date, formatStr, {
		locale: LocaleObj,
	});
};

export const parseDate = (value, dateFormat, locale) => {
	const LocaleObj = getLocaleObject(locale);
	const parsedDate = parse(value, dateFormat, new Date(), {
		locale: LocaleObj,
	});

	return isValid(parsedDate) ? parsedDate : null;
};

export const getFirstWeekDay = (weekDate, locale) => {
	const LocaleObj = getLocaleObject(locale);
	return startOfWeek(weekDate, {
		locale: LocaleObj,
	});
};

export const getFirstMonthDay = (monthDate) => {
	return startOfMonth(monthDate);
};

/**
 *
 * @param {String} localeName - locale key
 * @param {Locale} localeObj - locale object
 */
export const addLocale = (localeName, localeObj) => {
	const scope = getScope();

	if (!scope.__localeData__) scope.__localeData__ = {};

	scope.__localeData__[localeName] = localeObj;
};

export const getLocaleObject = (localeInfo) => {
	if (!localeInfo) {
		return getDefaultLocale();
	}
	if (typeof localeInfo === 'string') {
		const scope = getScope();

		// default is en-US
		return scope.__localeData__ && scope.__localeData__[localeInfo]
			? scope.__localeData__[localeInfo]
			: getDefaultLocale();
	}

	// We assume it is a raw date-fns Locale object
	return localeInfo;
};

export const getDefaultLocale = () => {
	const scope = getScope();

	// if users define their own default, just use it; otherwise, we give en-US as default locale
	return scope.__default_locale__ || enUS;
};
export const registerDefaultLocale = (localeObj) => {
	const scope = getScope();

	scope.__default_locale__ = localeObj;
};

export const getWeekdayNameInLocale = (date, locale) => {
	return formatDate(date, 'EEEEEE', locale);
};

export const setTime = (date, { hour = 0, min = 0 }) => {
	if (!isValid(date)) return null;
	if (typeof hour !== 'number' || typeof min !== 'number') return null;
	return setHours(setMinutes(date, min), hour);
};

export function isYearPrevDisabled(day, { minDate } = {}) {
	const prevYear = subYears(day, 1);

	return minDate && differenceInCalendarYears(minDate, prevYear) > 0;
}

export function isMonthPrevDisabled(day, { minDate } = {}) {
	const prevMonth = subMonths(day, 1);

	return minDate && differenceInCalendarMonths(minDate, prevMonth) > 0;
}

export function isYearNextDisabled(day, { maxDate } = {}) {
	const nextYear = addYears(day, 1);

	return maxDate && differenceInCalendarYears(nextYear, maxDate) > 0;
}

export function isMonthNextDisabled(day, { maxDate } = {}) {
	const nextMonth = addMonths(day, 1);

	return maxDate && differenceInCalendarMonths(nextMonth, maxDate) > 0;
}

export function isDayDisabled(day, info = {}) {
	const { minDate, maxDate, includeDates, excludeDates } = info;

	return (
		((minDate || maxDate) && !isDayInRange(day, minDate, maxDate)) ||
		(includeDates && !includeDates.some((inc) => isSameDay(day, inc))) ||
		(excludeDates && excludeDates.some((exc) => isSameDay(day, exc)))
	);
}

export function determineMinMax(dateLeft, dateRight) {
	if (differenceInCalendarDays(dateLeft, dateRight) > 0)
		return [dateRight, dateLeft];

	return [dateLeft, dateRight];
}

export function isDayInRange(day, dateLeft, dateRight) {
	if (!dateLeft || !dateRight) {
		return (
			(dateLeft && differenceInCalendarDays(day, dateLeft) >= 0) ||
			(dateRight && differenceInCalendarDays(day, dateRight) <= 0)
		);
	} else {
		const [min, max] = determineMinMax(dateLeft, dateRight);
		let valid;

		try {
			valid = isWithinInterval(day, {
				start: startOfDay(min),
				end: endOfDay(max),
			});
		} catch (err) {
			valid = false;
		}
		return valid;
	}
}
export function isTimeBefore(time, timeToComp) {
	const timeHour = getHours(time);
	const timeMin = getMinutes(time);
	const compHour = getHours(timeToComp);
	const compMin = getMinutes(timeToComp);
	return timeHour === compHour ? timeMin < compMin : timeHour < compHour;
}
export function isTimeAfter(time, timeToComp) {
	const timeHour = getHours(time);
	const timeMin = getMinutes(time);
	const compHour = getHours(timeToComp);
	const compMin = getMinutes(timeToComp);
	return timeHour === compHour ? timeMin > compMin : timeHour > compHour;
}

// Date getters
export {
	getHours,
	getMinutes,
	getDate,
	startOfDay as getStartOfDay,
	endOfDay as getEndOfDay,
};

// addition operations
export { addDays, addWeeks, addMonths, addYears };

// substraction operations
export { subMonths, subYears };

export const checkEqual = (dateLeft, dateRight) => {
	if (dateLeft && dateRight) return isSameDay(dateLeft, dateRight);
	return false;
};
export { isSameMonth, isBefore };
