import React, { Component } from 'react';
import './CourseTeaDeadline.css';
import { connect } from 'react-redux';
import {
	Paper,
	Typography,
	Toolbar,
	Fab,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	IconButton,
	Button,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	ListItemAvatar,
	Avatar,
	Tooltip
} from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';

import CourseDeadlineTable from './CourseDeadlineTable';
import Loading from '../../CommonComponent/Other/Loading';
import ModalDeadline from '../../CommonComponent/Modal/ModalDeadline';

import * as actions from '../../../../actions';
import docIco from '../../../../assets/images/ico/doc-ico.svg';
import WebService from '../../../../services/WebService';

class CourseTeaDeadline extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowDelPopup: false,
			isShowSubmitPopup: false,
			isWaiting: false,
			deadlineList: [],
			submitList: [],
			deadlineSel: '',
			deadlineExpiredList: [],
			deadlineExpiredCount: 0
		};
		this.webService = new WebService();
	}

	componentDidMount() {
		this.callApiGetListExercise();
	}

	callApiGetListExercise = async () => {
		this.setState({ isWaiting: true });
		const courseId = this.props.courseDetailData.CourseId;
		const resApi = await this.webService.getListExercise(courseId);
		this.handleGetListExerciseApi(resApi);
		this.setState({ isWaiting: false });
	};

	handleGetListExerciseApi = (resApi) => {
		if (resApi.returnCode === 0) {
			this.props.showNotice(resApi.returnMess, 0);
		} else {
			const result = resApi.data;
			this.setState({ deadlineList: result }, () => {
				this.handleExpiredExcercise();
			});
		}
	};

	handleAddDeadline = () => {
		this.props.showDeadline(0, null);
	};

	handleOpenDelPopup = (idDeadline) => {
		this.setState({ isShowDelPopup: true, deadlineSel: idDeadline });
	};

	handleOpenUpdatePopup = (deadlineData) => {
		this.props.showDeadline(1, deadlineData);
	};

	handleOpenSubmitPopup = (deadlineId) => {
		this.callApiGetSubmitExercise(deadlineId);
	};

	handleConfirmDelPopup = (e, deadlineId) => {
		this.callApiDeleteExercise(deadlineId);
	};

	callApiDeleteExercise = async (deadlineId) => {
		const resApi = await this.webService.deleteExercise(deadlineId);
		this.handleDeleteExerciseApi(resApi);
	};

	handleDeleteExerciseApi = (resApi) => {
		if (resApi.returnCode === 0) {
			this.props.showNotice(resApi.returnMess, 0);
		} else {
			this.props.showNotice(resApi.returnMess, 1);
			this.callApiGetListExercise();
			this.setState({ isShowDelPopup: false });
		}
	};

	handleCloseDelPopup = () => {
		this.setState({ isShowDelPopup: false });
	};

	handleCloseSubmitPopup = () => {
		this.setState({ isShowSubmitPopup: false });
	};

	callApiGetSubmitExercise = async (deadlineId) => {
		const resApi = await this.webService.getSubmitExercise(deadlineId);
		this.handleGetSubmitExerciseApi(resApi);
	};

	handleGetSubmitExerciseApi = (resApi) => {
		if (resApi.returnCode === 0) {
			this.props.showNotice(resApi.returnMess, 0);
		} else {
			const result = resApi.data;
			console.log(result);
			this.setState({ isShowSubmitPopup: true, submitList: result });
		}
	};

	handleExpiredExcercise = () => {
		const self = this;
		const { deadlineList } = this.state;
		let deadlineExpiredList = [];
		deadlineList.forEach((data) => {
			if (new Date() > new Date(data.EndDate))
				self.setState({ deadlineExpiredCount: self.state.deadlineExpiredCount + 1 });
		});
		deadlineExpiredList = deadlineList.filter((data) => {
			const date1 = new Date(data.EndDate);
			const date2 = new Date();
			const diffTime = Math.abs(date1.getTime() - date2.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			return diffDays <= 7 && diffDays >= 0;
		});
		this.setState({ deadlineExpiredList });
	};

	reloadData = () => {
		this.callApiGetListExercise();
	};

	render() {
		const {
			isShowDelPopup,
			isShowSubmitPopup,
			deadlineSel,
			isWaiting,
			deadlineList,
			submitList,
			deadlineExpiredCount,
			deadlineExpiredList
		} = this.state;
		return (
			<div className="course-teacher-deadline">
				<div className="row">
					<div className="course-deadline-list col-md-8 col-xs-12 col-12">
						{isWaiting && <Loading />}
						{!isWaiting && (
							<CourseDeadlineTable
								deadlineList={deadlineList}
								openDelPopup={this.handleOpenDelPopup}
								openUpdatePopup={this.handleOpenUpdatePopup}
								openSubmitPopup={this.handleOpenSubmitPopup}
							/>
						)}
					</div>
					<div className="course-deadline-info col-md-4 col-xs-12 col-12">
						<Paper elevation={4}>
							<Toolbar>
								<div>
									<Typography variant="h6" id="tableTitle">
										Thông tin tổng quát
									</Typography>
								</div>
							</Toolbar>
							<div style={styles.deadlineInfo}>
								<Typography variant="subtitle1" gutterBottom>
									Số bài tập đã tạo: {deadlineList.length}
								</Typography>
								<Typography variant="subtitle1" gutterBottom>
									Số bài tập hết hạn: {deadlineExpiredCount}
								</Typography>
								<Typography variant="subtitle1" gutterBottom>
									Thông tin tổng quát:
								</Typography>
							</div>
							<div style={styles.deadlineAdd}>
								<Fab
									variant="extended"
									color="primary"
									aria-label="Add"
									onClick={this.handleAddDeadline}
								>
									<Add />
									Thêm bài tập
								</Fab>
							</div>
						</Paper>
						<Paper style={styles.deadlineNotice} elevation={4}>
							<Toolbar>
								<div>
									<Typography variant="h6" id="tableTitle">
										Bài tập sắp hết hạn
									</Typography>
								</div>
							</Toolbar>
							{DeadlineExpiredList(deadlineExpiredList)}
						</Paper>
					</div>
					{DeadlineDelConfirm(
						isShowDelPopup,
						deadlineSel,
						this.handleCloseDelPopup,
						this.handleConfirmDelPopup
					)}
					{DeadlineSubmitList(isShowSubmitPopup, submitList, this.handleCloseSubmitPopup)}
				</div>
				<ModalDeadline
					courseId={this.props.courseDetailData.CourseId}
					webService={this.webService}
					reloadData={this.reloadData}
				/>
			</div>
		);
	}
}

const DeadlineExpiredList = (deadlineExpiredList) => {
	return (
		<div style={styles.deadlineEnd}>
			{deadlineExpiredList.map((data, index) => {
				const expiredDate = data.EndDate.replace('T', ' ');
				return (
					<div key={index} className="d-flex align-items-center flex-wrap deadline-finish-item">
						<div className="deadline-title d-flex align-items-center ">
							<img className="deadline-ico" src={docIco} alt="" />
							<span>{data.Title}</span>
						</div>
						<div className="deadline-date d-flex align-items-center">
							<span>{expiredDate}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};

const DeadlineDelConfirm = (isShowDelPopup, deadlineSel, handleCloseDelPopup, handleConfirmDelPopup) => {
	return (
		<Dialog open={isShowDelPopup} onClose={handleCloseDelPopup} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title" style={styles.deadlineModal.dialogTitle}>
				<div>
					<b>Xoá bài tập</b>
				</div>
				<IconButton
					// disabled={isWaiting}
					style={styles.deadlineModal.dialogClose}
					aria-label="Close"
					onClick={handleCloseDelPopup}
				>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent style={styles.deadlineModal.dialogContent}>
				<DialogContentText color="secondary">
					<b>Bạn có muốn xoá bài tập này không?</b>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDelPopup} color="primary">
					<b>Đóng</b>
				</Button>
				<Button
					color="primary"
					onClick={(e, _deadlineSel = deadlineSel) => handleConfirmDelPopup(e, _deadlineSel)}
				>
					<b>OK</b>
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const DeadlineSubmitList = (isShowSubmit, submitList, handleCloseSubmitPopup) => {
	return (
		<Dialog
			fullWidth
			maxWidth="sm"
			open={isShowSubmit}
			onClose={handleCloseSubmitPopup}
			aria-labelledby="form-dialog-submit"
		>
			<DialogTitle id="form-dialog-title" style={styles.deadlineModal.dialogTitle}>
				<div>
					<b>Danh sách bài nộp</b>
				</div>
				<IconButton
					// disabled={isWaiting}
					style={styles.deadlineModal.dialogClose}
					aria-label="Close"
					onClick={handleCloseSubmitPopup}
				>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent style={styles.deadlineModal.dialogContent}>
				<List component="ul">
					{submitList.map((data, index) => {
						return <DeadlineSubmitItem key={index} submitItem={data} />;
					})}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseSubmitPopup} color="primary">
					<b>Đóng</b>
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const DeadlineSubmitItem = (props) => {
	const dateSubmit = new Date(props.submitItem.Time);
	const dateSubmitCvt =
		'' +
		dateSubmit.getDate() +
		'/' +
		dateSubmit.getMonth() +
		'/' +
		dateSubmit.getFullYear() +
		' ' +
		dateSubmit.getHours() +
		':' +
		dateSubmit.getMinutes();
	return (
		<ListItem divider dense={true}>
			<ListItemAvatar>
				<Avatar style={styles.deadlineAvatar}>
					<i className="fas fa-user-graduate" />
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={
					<Typography type="body1">
						<b>{props.submitItem.Name}</b>
					</Typography>
				}
				secondary={
					<Typography type="body1">
						<b>{props.submitItem.Email}</b>
					</Typography>
				}
			/>
			<ListItemSecondaryAction style={styles.deadlineActions}>
				<ListItemText
					primary={
						<Typography type="body1" color="secondary">
							<b>{dateSubmitCvt}</b>
						</Typography>
					}
				/>
				<Tooltip title="Tải về">
					<IconButton color="primary">
						<i className="fas fa-cloud-download-alt" />
					</IconButton>
				</Tooltip>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

const styles = {
	deadlineInfo: {
		paddingLeft: '1.5em',
		paddingRight: '1.5em',
		paddingBottom: '1em'
	},
	deadlineNotice: {
		height: 290,
		marginTop: '1em',
		overflowY: 'auto'
	},
	deadlineEnd: {
		paddingLeft: '1.5em',
		paddingRight: '1.5em',
		paddingBottom: '0.5em'
	},
	deadlineAdd: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		paddingBottom: '1em'
	},
	deadlineModal: {
		dialogTitle: {
			position: 'relative'
		},
		dialogClose: {
			position: 'absolute',
			top: 0,
			right: 0
		},
		textField: {
			border: '1px solid #000000'
		}
	},
	deadlineAvatar: {
		backgroundColor: '#02BF99',
		color: '#fff'
	},
	deadlineActions: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
};

export default connect(null, actions)(CourseTeaDeadline);
