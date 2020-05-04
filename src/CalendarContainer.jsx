import React from 'react';

const CalendarContainer = ({
    className,
    children
}) => {
    return (
        <div className = {className}>
            {children}
        </div>
    );
};

export default CalendarContainer;