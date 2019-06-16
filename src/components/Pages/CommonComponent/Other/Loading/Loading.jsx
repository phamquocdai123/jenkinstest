import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';

class Loading extends Component {
	render() {
		return <CircularProgress style={{ width: 25, height: 25 }} disableShrink />;
	}
}

export default Loading;
