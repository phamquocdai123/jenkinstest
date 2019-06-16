import React, { Component } from 'react';
import './ModalSubmit.css';
import { connect } from 'react-redux';
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
	IconButton
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import Loading from '../../Other/Loading';

import * as actions from '../../../../../actions';
import SystemHelper from '../../../../../services/SystemHelper';

class ModalSubmit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitContentSel: '',
			submitFileSel: null,
			isWaiting: false
		};
		this.helper = new SystemHelper();
	}

	handleSubmitDeadline = () => {
		let { submitContentSel, submitFileSel } = this.state;
		const validate = this.helper.checkValidateSubmit(submitContentSel, submitFileSel);
		if (validate !== '') {
			this.props.showNotice(validate, 0);
			return;
		} else {
			this.callApiSubmitExercise();
		}
	};

	handleCloseSubmit = () => {
		this.props.handleCloseSubmitPopup();
		this.handleResetForm();
	};

	handleResetForm = () => {
		const self = this;
		self.setState({
			submitContentSel: '',
			submitFileSel: null
		});
	};

	callApiSubmitExercise = async () => {
		let submitData = new FormData();
		const { data } = this.props.popupData;
		console.log(data)
		submitData.append('UserId', this.props.webService.getUserId());
		submitData.append('ExerciseId', data.Id);
		submitData.append('Link', this.state.submitFileSel);
		submitData.append('Content', this.state.submitContentSel);

		this.setState({ isWaiting: true });
		const resApi = await this.props.webService.submitExercise(submitData);
		this.handleSubmitExerciseApi(resApi);
		this.setState({ isWaiting: false });
	};

	handleSubmitExerciseApi = (res) => {
		if (res.returnCode === 0) {
			this.props.showNotice(res.returnMess, 0);
		} else {
			this.props.showNotice(res.returnMess, 1);
			this.handleCloseSubmit();
		}
	};

	handleChangeContent = (e) => {
		this.setState({ submitContentSel: e.target.value });
	};

	handleChangeFile = (e) => {};

	render() {
		const { isOpen, type, data } = this.props.popupData;
		const { isWaiting } = this.state;
		return (
			<div className="hw-modal-submit">
				<Dialog
					open={isOpen}
					onClose={this.handleCloseSubmit}
					aria-labelledby="form-dialog-title"
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle id="form-dialog-title" style={styles.deadlineModal.dialogTitle}>
						<div>
							{type === 0 ? (
								<b>
									Chi tiết bài tập <span>{data.Title}</span>
								</b>
							) : (
								<b>
									Nộp bài tập <span>{data.Title}</span>
								</b>
							)}
						</div>
						<IconButton
							disabled={isWaiting}
							style={styles.deadlineModal.dialogClose}
							aria-label="Close"
							onClick={this.handleCloseSubmit}
						>
							<Close />
						</IconButton>
					</DialogTitle>
					{type === 0 ? (
						<DetailDialog deadlineDetail={data} />
					) : (
						<SubmitDialog
							handleChangeContent={this.handleChangeContent}
							handleChangeFile={this.handleChangeFile}
						/>
					)}
					<DialogActions>
						{isWaiting && <Loading />}
						<Button disabled={isWaiting} onClick={this.handleCloseSubmit} color="primary">
							<b>Đóng</b>
						</Button>
						{type === 1 && (
							<Button
								disabled={isWaiting}
								variant="contained"
								color="primary"
								onClick={this.handleSubmitDeadline}
							>
								<b style={{ color: 'white' }}>Nộp bài</b>
							</Button>
						)}
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

const SubmitDialog = (props) => {
	return (
		<DialogContent style={styles.deadlineModal.dialogContent}>
			<DialogContentText color="secondary">
				<b>*Bạn phải nhập ít nhất một ô để nộp bài</b>
			</DialogContentText>
			<div className="submit-process">
				<TextField
					variant="outlined"
					multiline
					rows="10"
					margin="dense"
					id="contentSubmit"
					label="Nhập nội dung bài tập"
					type="text"
					onChange={props.handleChangeContent}
					fullWidth
				/>
				<TextField
					variant="outlined"
					margin="dense"
					id="fileSubmit"
					label="Tải file bài nộp"
					type="file"
					InputLabelProps={{
						shrink: true
					}}
					onChange={props.handleChangeFile}
					fullWidth
				/>
				<Typography variant="subtitle1">File đã nộp: </Typography>
			</div>
		</DialogContent>
	);
};

const DetailDialog = (props) => {
	return (
		<DialogContent style={styles.deadlineModal.dialogContent}>
			<DialogContentText color="secondary">{props.deadlineDetail.Threads}</DialogContentText>
		</DialogContent>
	);
};

const styles = {
	deadlineModal: {
		dialogTitle: {
			position: 'relative'
		},
		dialogContent: {
			height: 400
		},
		dialogClose: {
			position: 'absolute',
			top: 0,
			right: 0
		},
		textField: {
			border: '1px solid #000000'
		}
	}
};

const mapStateToProps = (state) => ({
	deadlinePopup: state.deadlinePopup
});

export default connect(mapStateToProps, actions)(ModalSubmit);
