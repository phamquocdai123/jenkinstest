import React, { Component } from 'react';
import './ModalNotice.css';
import { connect } from 'react-redux';
import { Snackbar, SnackbarContent } from '@material-ui/core';

import * as actions from '../../../../../actions';

class ModalNotice extends Component {
	handleCloseSnackbarNotice = () => {
		this.props.closeNotice();
	};
	render() {
		const { isShowNotice, noticeMess, type } = this.props.noticePopup;
		return (
			<div className="hw-popup-info">
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					open={isShowNotice}
					autoHideDuration={3000}
					onClose={this.handleCloseSnackbarNotice}
					ContentProps={{
						'aria-describedby': 'message-id'
					}}
				>
					<SnackbarContent
						style={type === 1 ? styles.succesNotice : styles.errorNotice}
						aria-describedby="notice-snackbar"
						message={
							<span id="notice-snackbar" className="notice-snackbar">
								{type === 1 ? (
									<i className="far fa-check-circle fa-2x" />
								) : (
									<i className="fas fa-times fa-2x" />
								)}
								<span>{noticeMess}</span>
							</span>
						}
					/>
				</Snackbar>
			</div>
		);
	}
}

const styles = {
	succesNotice: {
		backgroundColor: 'green'
	},
	errorNotice: {
		backgroundColor: '#FF7062'
	}
};

const mapStateToProps = (state) => ({
	noticePopup: state.noticePopup
});

export default connect(mapStateToProps, actions)(ModalNotice);
