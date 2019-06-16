import React, { Component } from 'react';
import './ModalDeadline.css';
import { connect } from 'react-redux';
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stepper,
	StepLabel,
	Step,
	IconButton,
	Typography
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import Loading from '../../Other/Loading';

import * as actions from '../../../../../actions';
import SystemHelper from '../../../../../services/SystemHelper';

class ModalDeadline extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deadlineStepIdx: 0,
			deadlineTitleSel: '',
			deadlineDescrSel: '',
			deadlineDateSel: '',
			deadlineFileSel: null,
			isWaiting: false
		};
		this.helper = new SystemHelper();
		this.refTitle = null;
		this.deadlineStepLabel = ['Bước 1', 'Bước 2', 'Bước 3'];
		this.deadlineStepTitle = ['Tiêu đề', 'Chi tiết bài tập', 'File bài tập'];
	}

	handleCloseDeadline = () => {
		this.props.closeDeadline();
		this.handleResetForm();
	};

	handleResetForm = () => {
		const self = this;
		self.setState({
			deadlineStepIdx: 0,
			deadlineTitleSel: '',
			deadlineDescrSel: '',
			deadlineDateSel: '',
			deadlineFileSel: null
		});
	};

	handleNextStep = () => {
		let { deadlineStepIdx, deadlineTitleSel, deadlineDescrSel, deadlineFileSel } = this.state;
		const { type } = this.props.deadlinePopup;
		const validate = this.helper.checkValidateDeadline(deadlineStepIdx, deadlineTitleSel, deadlineDescrSel, deadlineFileSel);
		if (validate !== '') {
			this.props.showNotice(validate, 0);
			return;
		} else {
			if (this.state.deadlineStepIdx < this.deadlineStepLabel.length - 1) {
				this.setState({ deadlineStepIdx: this.state.deadlineStepIdx + 1 });
			} else if (this.state.deadlineStepIdx === this.deadlineStepLabel.length - 1) {
				if (type === 0) {
					this.callApiCreateDeadline();
				} else if (type === 1) {
					this.callApiUpdateDeadline();
				}
			}
		}
	};

	callApiCreateDeadline = async () => {
		let deadlineData = new FormData();
		deadlineData.append('CourseId', this.props.courseId);
		deadlineData.append('Title', this.state.deadlineTitleSel);
		deadlineData.append('EndDate', this.state.deadlineDateSel);
		deadlineData.append('Threads', this.state.deadlineDescrSel);
		deadlineData.append('ThreadFile', this.state.deadlineFileSel === null ? '' : this.state.deadlineFileSel);
		this.setState({ isWaiting: true });
		const resApi = await this.props.webService.createExercise(deadlineData);
		this.handleCreateDeadlineApi(resApi);
		this.setState({ isWaiting: false });
	};

	handleCreateDeadlineApi = (res) => {
		if (res.returnCode === 0) {
			this.props.showNotice(res.returnMess, 0);
		} else {
			this.props.showNotice(res.returnMess, 1);
			this.props.reloadData();
			this.handleResetForm();
		}
	};

	callApiUpdateDeadline = async () => {
		const { data } = this.props.deadlinePopup;
		let deadlineData = new FormData();
		deadlineData.append('Id', data.deadlineId);
		deadlineData.append('Title', this.state.deadlineTitleSel);
		deadlineData.append('EndDate', this.state.deadlineDateSel);
		deadlineData.append('Threads', this.state.deadlineDescrSel);
		deadlineData.append('ThreadFile', this.state.deadlineFileSel === null ? '' : this.state.deadlineFileSel);
		this.setState({ isWaiting: true });
		const resApi = await this.props.webService.updateExercise(deadlineData);
		this.handleUpdateDeadlineApi(resApi);
		this.setState({ isWaiting: false });
	};

	handleUpdateDeadlineApi = (res) => {
		if (res.returnCode === 0) {
			this.props.showNotice(res.returnMess, 0);
		} else {
			this.props.showNotice(res.returnMess, 1);
			this.props.reloadData();
			this.props.closeDeadline();
		}
	};

	handleChangeTitle = (e) => {
		this.setState({ deadlineTitleSel: e.target.value });
	};

	handleChangeDescription = (e) => {
		this.setState({ deadlineDescrSel: e.target.value });
	};

	handleChangeDate = (e) => {
		this.setState({ deadlineDateSel: e.target.value });
	};

	handleChangeFile = (e) => {
		this.setState({ deadlineFileSel: e.target.files[0] })
	};

	getStepContent = (index, data) => {
		let deadlineData = {
			deadlineTitleInit: '',
			deadlineDescrInit: '',
			deadlineDateInit: '',
			deadlineFileInit: null
		};
		if (data !== null) {
			deadlineData.deadlineTitleInit = data.deadlineTitle;
			deadlineData.deadlineDescrInit = data.deadlineDescr;
			deadlineData.deadlineDateInit = data.finishDate;
			deadlineData.deadlineFileInit = data.deadlineFile;
		}
		switch (index) {
			case 0:
				return deadlineStepFirst(this.handleChangeTitle, deadlineData.deadlineTitleInit);
			case 1:
				return deadlineStepSecond(this.handleChangeDescription, deadlineData.deadlineDescrInit);
			case 2:
				return deadlineStepThird(
					this.handleChangeDate,
					this.handleChangeFile,
					deadlineData.deadlineDateInit,
					deadlineData.deadlineFileInit,
					this.props.deadlinePopup.type
				);
			default:
				return deadlineStepFirst(this.handleChangeTitle, deadlineData.deadlineTitleInit);
		}
	};

	render() {
		const { isShowDeadline, type, data } = this.props.deadlinePopup;
		const { deadlineStepIdx, isWaiting } = this.state;
		const deadlineStepLabel = this.deadlineStepLabel;
		const deadlineStepTitle = this.deadlineStepTitle;
		return (
			<div className="hw-modal-deadline">
				<Dialog
					open={isShowDeadline}
					onClose={this.handleCloseDeadline}
					aria-labelledby="form-dialog-title"
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle id="form-dialog-title" style={styles.deadlineModal.dialogTitle}>
						<div>{type === 0 ? <b>Thêm mới bài tập</b> : <b>Chỉnh sửa bài tập</b>}</div>
						<IconButton
							disabled={isWaiting}
							style={styles.deadlineModal.dialogClose}
							aria-label="Close"
							onClick={this.handleCloseDeadline}
						>
							<Close />
						</IconButton>
					</DialogTitle>
					<DialogContent style={styles.deadlineModal.dialogContent}>
						<DialogContentText color="secondary">
							*Bạn phải hoàn thành 3 bước để hoàn tất việc tạo/chỉnh sửa
						</DialogContentText>
						<div className="deadline-process">
							<Stepper alternativeLabel activeStep={deadlineStepIdx} orientation="horizontal">
								{deadlineStepLabel.map((_, index) => (
									<Step key={deadlineStepLabel[index]}>
										<StepLabel style={{ fontWeight: 'bold' }}>
											<b>{deadlineStepLabel[index]}</b>
											<br />
											<b>({deadlineStepTitle[index]})</b>
										</StepLabel>
									</Step>
								))}
							</Stepper>
							{this.getStepContent(deadlineStepIdx, data)}
						</div>
					</DialogContent>
					<DialogActions>
						{isWaiting && <Loading />}
						<Button disabled={isWaiting} onClick={this.handleCloseDeadline} color="primary">
							<b>Đóng</b>
						</Button>
						<Button disabled={isWaiting} variant="contained" color="primary" onClick={this.handleNextStep}>
							<b>
								{deadlineStepIdx === deadlineStepLabel.length - 1 ? (
									<span>{type === 0 ? 'Tạo khoá học' : 'Cập nhật'} </span>
								) : (
										'Tiếp theo'
									)}
							</b>
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

const deadlineStepFirst = (handleChangeTitle, deadlineTitle) => {
	return (
		<div className="deadline-step-1">
			<TextField
				variant="outlined"
				defaultValue={deadlineTitle}
				autoFocus
				margin="dense"
				id="nameDeadline"
				label="Nhập tiêu đề bài tập"
				type="text"
				onBlur={handleChangeTitle}
				fullWidth
			/>
		</div>
	);
};

const deadlineStepSecond = (handleChangeDescription, deadlineDescr) => {
	return (
		<div className="deadline-step-2">
			<TextField
				variant="outlined"
				defaultValue={deadlineDescr}
				autoFocus
				multiline
				rows="9"
				margin="dense"
				id="descrDeadline"
				label="Nhập chi tiết bài tập"
				type="text"
				onBlur={handleChangeDescription}
				fullWidth
			/>
		</div>
	);
};

const deadlineStepThird = (handleChangeDate, handleChangeFile, deadlineDate, deadlineFile, type) => {
	let _deadlineDate = '';
	if (deadlineDate && deadlineDate !== '') _deadlineDate = deadlineDate.replace(' ', 'T');
	return (
		<div className="deadline-step-3">
			<TextField
				variant="outlined"
				autoFocus
				defaultValue={_deadlineDate}
				margin="dense"
				fullWidth
				id="datetime"
				label="Nhập ngày hết hạn"
				type="datetime-local"
				InputLabelProps={{
					shrink: true
				}}
				onBlur={handleChangeDate}
			/>
			<TextField
				variant="outlined"
				margin="dense"
				id="fileDeadline"
				label="Tải file bài tập"
				type="file"
				InputLabelProps={{
					shrink: true
				}}
				onBlur={handleChangeFile}
				fullWidth
			/>
			{type === 1 && <Typography variant="subtitle1">File đã tạo: {deadlineFile}</Typography>}
		</div>
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

export default connect(mapStateToProps, actions)(ModalDeadline);
