import React from 'react';

const RDXContext = React.createContext();

export function connect(WrappedComponent, select) {
	return function (props) {
		const selectors = select();
		return <WrappedComponent {...selectors} {...props} />;
	};
}

export default RDXContext;
