import React, { Component } from 'react';
import './HeaderTitle.css';

import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { Typography, Button } from '@material-ui/core';

class HeaderTitle extends Component {
	render() {
		const { isShow, title } = this.props.pageTitle;
		console.log(this.props.pageTitle);
		return (
			<div className="hw-header-title">
				{isShow === false ? null : (
					<div className="hw-header-title-content hw-overlay">
						<Typography align="center" className="hw-header-title-page" variant="h2" gutterBottom>
							{title}
						</Typography>
						{/* <div className="hw-header-button">
							<Button variant="contained">Default</Button>
						</div> */}
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	pageTitle: state.pageTitle
});

export default connect(mapStateToProps, actions)(HeaderTitle);
