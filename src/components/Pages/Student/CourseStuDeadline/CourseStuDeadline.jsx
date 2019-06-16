import React, { Component } from 'react';
import './CourseStuDeadline.css';
import {
	Paper,
	Typography,
	Toolbar,
	List,
	Grid,
	Button,
	ListItem,
	ListItemText,
	ListItemSecondaryAction
} from '@material-ui/core';

import ModalSubmit from '../../CommonComponent/Modal/ModalSubmit';
import Loading from '../../CommonComponent/Other/Loading';
import docIco from '../../../../assets/images/ico/doc-ico.svg';
import WebService from '../../../../services/WebService';

class CourseStuDeadline extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deadlineList: [],
			isWaiting: false,
			submitPopup: {
				isOpen: false,
				type: 0,
				data: {}
			}
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
		console.log(resApi)
		if (resApi.returnCode === 0) {
			this.props.showNotice(resApi.returnMess, 0);
		} else {
			const result = resApi.data;
			this.setState({ deadlineList: result });
		}
	};

	handleOpenSubmitPopup = (e, type, index) => {
		e.preventDefault();
		const deadlineDetail = this.state.deadlineList[index];
		this.setState({
			submitPopup: {
				...this.state.submitPopup,
				isOpen: true,
				type: type,
				data: deadlineDetail
			}
		});
	};

	handleCloseSubmitPopup = () => {
		this.setState({
			submitPopup: {
				...this.state.submitPopup,
				isOpen: false,
				data: {}
			}
		});
	};

	render() {
		const { deadlineList, isWaiting, submitPopup } = this.state;
		return (
			<div className="course-student-deadline">
				<Paper elevation={4}>
					<Toolbar>
						<div className="student-deadline-title">
							<Typography variant="h6" id="tableTitle">
								Danh sách bài tập
							</Typography>
						</div>
					</Toolbar>
					{isWaiting && (
						<div className="loading-custom">
							<Loading />
						</div>
					)}
					{!isWaiting && (
						<DeadlineListItem
							deadlineList={deadlineList}
							handleOpenSubmitPopup={this.handleOpenSubmitPopup}
						/>
					)}
				</Paper>
				<ModalSubmit webService={this.webService} popupData={submitPopup} handleCloseSubmitPopup={this.handleCloseSubmitPopup} />
			</div>
		);
	}
}

const DeadlineListItem = (props) => {
	const deadlineList = props.deadlineList;
	return (
		<Grid item xs={12} md={12}>
			<div className="student-deadline-item">
				<List dense={true}>
					{deadlineList.map((data, index) => {
						return (
							<ListItem key={index}>
								<img src={docIco} alt="" style={{ width: '35px', height: '35px' }} />
								<ListItemText primary={data.Title} secondary={'Hết hạn: ' + data.EndDate} />
								<ListItemSecondaryAction>
									<Button
										style={styles.btnDetail}
										color="primary"
										variant="outlined"
										onClick={(e, type = 0, _index = index) =>
											props.handleOpenSubmitPopup(e, type, _index)}
									>
										<b>Xem chi tiết</b>
									</Button>
									<Button
										color="secondary"
										variant="outlined"
										onClick={(e, type = 1, _index = index) =>
											props.handleOpenSubmitPopup(e, type, _index)}
									>
										<b>Nộp bài</b>
									</Button>
								</ListItemSecondaryAction>
							</ListItem>
						);
					})}
				</List>
			</div>
		</Grid>
	);
};

const styles = {
	btnDetail: {
		marginLeft: '0.5em',
		marginRight: '0.5em'
	}
};

export default CourseStuDeadline;
