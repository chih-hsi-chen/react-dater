import React from 'react';
import PropTypes from 'prop-types';

export const RDXContext = React.createContext();

function ContextProvider(props) {
    return (
        <RDXContext.Provider value = {props}>
            {props.children}
        </RDXContext.Provider>
    );
}
ContextProvider.propTypes = {
    selected: PropTypes.instanceOf(Date),
    viewed: PropTypes.instanceOf(Date).isRequired,
    onDaySelect: PropTypes.func.isRequired,
};

export default ContextProvider;