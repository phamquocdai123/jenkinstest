import React, { Component } from 'react';
import './UserManage.css';
import { connect } from 'react-redux';
import { Paper, Typography, Fab, Tooltip, Avatar } from '@material-ui/core';
import { Add, Edit, Check } from '@material-ui/icons';

import ModalCourse from '../Modal/ModalCourse';
import Loading from '../Other/Loading';

import WebService from '../../../../services/WebService';
import * as actions from '../../../../actions';

import courseSample from '../../../../assets/images/pic/hw-course-sample.jpg';
import courseManageUser from '../../../../assets/images/ico/course-manage-ico1.svg';
import courseManagePrice from '../../../../assets/images/ico/course-manage-ico2.svg';
import courseManageRate from '../../../../assets/images/ico/course-manage-ico3.svg';
import courseManageDate from '../../../../assets/images/ico/course-manage-ico4.svg';

class UserManage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			courseManage: [],
			courseSel: '',
			isWaiting: false
		};
		this.webService = new WebService();
	}

	componentDidMount() {
		this.callApiGetCourse();
	}

	callApiGetCourse = async () => {
		this.setState({ isWaiting: true });
		const resApi = await this.webService.getCourseList();
		this.handleGetCourseApi(resApi);
		this.setState({ isWaiting: false });
	};

	handleGetCourseApi = (res) => {
		console.log(res);
		if (res.returnCode === 0) {
			this.props.showNotice(res.returnMess, 0);
		} else {
			const result = res.data;
			this.setState({ courseManage: result });
		}
	};

	handleOpenCourseModal = (e, type) => {
		if (type === 0) {
			this.props.showCourse(0, null);
		} else {
			if (this.state.courseSel && this.state.courseSel !== '') {
				const courseDataSel = this.state.courseManage.filter((data) => {
					return data.Code === this.state.courseSel;
				});
				this.props.showCourse(1, courseDataSel);
			} else {
				this.props.showNotice('Bạn hãy chọn 1 khoá học để chỉnh sửa', 0);
			}
		}
	};

	handleSelectCourse = (e, index) => {
		e.preventDefault();

		if (this.state.courseSel === index) {
			this.setState({ courseSel: '' });
		} else {
			this.setState({ courseSel: index });
		}
	};

	getStudentEnroll = () => {
		const { courseManage } = this.state;
		let amountStudent = 0;
		if (courseManage.length > 0) {
			courseManage.forEach((data, index) => {
				amountStudent += data.AmountStudent;
			});
			return amountStudent;
		} else return 0;
	};

	reloadData = () => {
		this.callApiGetCourse();
	};

	render() {
		const { courseManage, courseSel, isWaiting } = this.state;
		return (
			<div className="hw-user-manage d-flex justify-content-center">
				<div className="container row">
					<div className="user-manage-action col-md-3">
						<Typography component="h5" variant="h6">
							Thông tin
						</Typography>
						<Paper elevation={2} style={styles.userActionPaper}>
							<div className="user-manage-info" style={styles.userAction}>
								<Typography component="h5" variant="subtitle1">
									Số khóa học đã tạo: {courseManage.length}
								</Typography>
								<Typography component="h5" variant="subtitle1">
									Số sinh viên tham gia: {this.getStudentEnroll()}
								</Typography>
							</div>
							<div />
						</Paper>
						<div className="user-manage-btn">
							<Tooltip title="Thêm" aria-label="Add">
								<Fab
									size="large"
									color="secondary"
									onClick={(e, _type = 0) => this.handleOpenCourseModal(e, _type)}
								>
									<Add />
								</Fab>
							</Tooltip>
							<Tooltip
								title="Chỉnh sửa"
								aria-label="Edit"
								onClick={(e, _type = 1) => this.handleOpenCourseModal(e, _type)}
							>
								<Fab size="large" color="primary" style={styles.editBtn}>
									<Edit />
								</Fab>
							</Tooltip>
						</div>
					</div>
					<div className="user-manage-course col-md-9">
						<Typography component="h5" variant="h6">
							Danh sách khóa học
						</Typography>
						{isWaiting && <Loading />}
						{CourseManageList(courseManage, courseSel, this.handleSelectCourse)}
						<ModalCourse webService={this.webService} reloadData={this.reloadData} />
					</div>
				</div>
			</div>
		);
	}
}

const CourseManageList = (courseManage, courseSel, handleSelectCourse) => {
	return (
		<div>
			{courseManage.map((courseData, _) => {
				return CourseManageItem(courseData, courseSel, handleSelectCourse);
			})}
		</div>
	);
};

const CourseManageItem = (courseData, courseSel, handleSelectCourse) => {
	const cvtCreateDate = new Date(courseData.CreateDate);
	const _cvtCreateDate = cvtCreateDate.getDate() + '-' + cvtCreateDate.getMonth() + '-' + cvtCreateDate.getFullYear();
	return (
		<Paper
			key={courseData.Code}
			elevation={2}
			style={styles.userCoursePaper}
			onClick={(e, _index = courseData.Code) => handleSelectCourse(e, _index)}
		>
			<img src={courseSample} alt="" />
			<div className="user-manage-course-item d-flex flex-column">
				<Typography id="course-manage-title" component="h5" variant="h6">
					{courseData.Title}
				</Typography>
				<div className="course-manage-row-1 d-flex">
					<Typography
						id="course-manage-title"
						component="h5"
						variant="subtitle1"
						style={styles.courseManageTitle}
					>
						<img src={courseManageUser} alt="" className="course-manage-ico" />
						<span>
							<b>Số tham gia:&nbsp;</b>
							{courseData.AmountStudent}
						</span>
					</Typography>
					<Typography
						id="course-manage-title"
						component="h5"
						variant="subtitle1"
						style={styles.courseManageTitle}
					>
						<img src={courseManagePrice} alt="" className="course-manage-ico" />
						<span>
							<b>Giá khóa học:&nbsp;</b>
							{courseData.Price} vnd
						</span>
					</Typography>
				</div>
				<div className="course-manage-row-2 d-flex">
					<Typography
						id="course-manage-title"
						component="h5"
						variant="subtitle1"
						style={styles.courseManageTitle}
					>
						<img src={courseManageRate} alt="" className="course-manage-ico" />
						<span>
							<b style={{ display: 'flex' }}>
								<span>Đánh giá:&nbsp;</span>
								<span>{StarRating(courseData.Rating)}</span>
							</b>
						</span>
					</Typography>
					<Typography
						id="course-manage-title"
						component="h5"
						variant="subtitle1"
						style={styles.courseManageTitle}
					>
						<img src={courseManageDate} alt="" className="course-manage-ico" />
						<span>
							<b>Ngày khởi tạo:&nbsp;</b>
							{_cvtCreateDate}
						</span>
					</Typography>
				</div>
			</div>
			{courseSel === courseData.Code ? (
				<Avatar style={styles.courseSelItem}>
					<Check />
				</Avatar>
			) : null}
		</Paper>
	);
};

const StarRating = (rate) => {
	return (
		<div className="hw-star-rating hw-star-rating-custom">
			{[ 1, 2, 3, 4, 5 ].map((_, index) => {
				return (
					<div key={index}>
						<i className={index <= rate - 1 ? 'fas fa-star hw-star-rate' : 'fas fa-star hw-star-hide'} />
					</div>
				);
			})}
		</div>
	);
};

const styles = {
	userAction: {
		padding: '1em'
	},
	userActionPaper: {
		height: 150
	},
	userCoursePaper: {
		height: 150,
		display: 'flex',
		flexWrap: 'nowrap',
		position: 'relative',
		marginBottom: '0.5em'
	},
	courseManageTitle: {
		display: 'flex',
		flex: '1',
		flexDirection: 'column'
	},
	courseSelItem: {
		width: 30,
		height: 30,
		position: 'absolute',
		top: 0,
		right: 0,
		margin: '0.5em',
		background: '#FF7062'
	},
	editBtn: {
		marginLeft: '0.5em',
		marginRight: '0.5em'
	}
};

export default connect(null, actions)(UserManage);
