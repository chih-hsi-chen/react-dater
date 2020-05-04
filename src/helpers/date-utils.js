import {
    format,
    startOfWeek,
    startOfMonth,
    addDays,
    addWeeks,
    addMonths,
    subMonths,
    parse,
    parseISO,
    toDate,
    isValid,
    getDate,
    isSameDay,
    isSameMonth,
} from 'date-fns';

import { /* enUS, enGB, */ zhTW } from "date-fns/locale";

const defaultLocaleObj = zhTW;

export const newDate = (initialValue) => {
    const date = initialValue ?
        typeof initialValue === 'string' || initialValue instanceof String
            ? parseISO(initialValue) : toDate(initialValue)
        : new Date();

    return isValid(date) ? date : new Date();
}

export const formatDate = (date, formatStr = 'yyyy-MM-dd', locale) => {
    const LocaleObj = getLocaleObject(locale);

    return format(date, formatStr, {
        locale: LocaleObj,
    });
}

export const parseDate = (value, dateFormat, locale) => {
    const LocaleObj = getLocaleObject(locale);
    const parsedDate = parse(value, dateFormat, new Date(), { locale: LocaleObj });

    return isValid(parsedDate) && parsedDate;
};

export const getFirstWeekDay = (weekDate, locale) => {
    const LocaleObj = getLocaleObject(locale);
    return startOfWeek(weekDate, {
        locale: LocaleObj
    });
}

export const getFirstMonthDay = (monthDate) => {
    return startOfMonth(monthDate);
}

export const getLocaleObject = (localeInfo) => {
    if(!localeInfo) {
        return defaultLocaleObj;
    }
    if (typeof localeInfo === 'string') {
        const scope = typeof window !== 'undefined' ? window : global;

        // default is en-US
        return scope.__localeData__ ? scope.__localeData__[localeInfo] : defaultLocaleObj;
    }

    // We assume it is a raw date-fns Locale object
    return localeInfo;
}

export const getWeekdayNameInLocale = (date, locale) => {
    return formatDate(date, 'EEEEEE', locale);
}

// Date getters
export { getDate };

// addition operations
export { addDays, addWeeks, addMonths };

// substraction operations
export { subMonths };

export const checkEqual = (date_1, date_2) => {
    if(date_1 && date_2)
        return isSameDay(date_1, date_2);
    return false;
}
export { isSameMonth };