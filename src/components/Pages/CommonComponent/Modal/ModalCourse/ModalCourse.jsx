import React, { Component } from 'react';
import './ModalCourse.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
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
	MenuItem,
	InputAdornment,
	Typography
} from '@material-ui/core';
import { Close, Clear } from '@material-ui/icons';

import Loading from '../../Other/Loading';

import * as actions from '../../../../../actions';
import SystemHelper from '../../../../../services/SystemHelper';

class ModalCourse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			courseStepIdx: 0,
			courseTitleSel: '',
			courseCategorySel: 'IT',
			courseDescrSel: '',
			courseLessonSel: [ '' ],
			coursePriceSel: '0',
			courseThumbSel: null,
			courseThumbExits: '',
			courseInfoSel: '',
			isWaiting: false
		};
		this.helper = new SystemHelper();
		this.lessonArr = [ '' ];
		this.courseStepLabel = [ 'Bước 1', 'Bước 2', 'Bước 3', 'Bước 4' ];
		this.courseStepTitle = [ 'Tiêu đề', 'Loại và mô tả', 'Bài học', 'Khác' ];
		this.courseCategoryLabel = [ 'IT', 'Toán học', 'Tiếng Anh', 'Văn học' ];
	}

	initExistData = (data, courseStepIdx) => {
		switch (courseStepIdx) {
			case 0:
				this.setState({
					courseTitleSel: data[0].Title,
					courseCategorySel: data[0].Type,
					courseDescrSel: data[0].Description
				});
				break;
			case 1:
				let lessonListTmp = [];
				lessonListTmp = data[0].LessionList.split('*#');
				lessonListTmp = lessonListTmp.filter((data) => {
					return data !== '';
				});
				if (lessonListTmp.length === 0) lessonListTmp = [ '' ];
				this.lessonArr = lessonListTmp;
				this.setState({ courseLessonSel: lessonListTmp });
				break;
			case 2:
				this.setState({
					coursePriceSel: data[0].Price,
					courseThumbExits: data[0].Avatar,
					courseInfoSel: data[0].StudyInfor
				});
				break;
			default:
				break;
		}
	};

	handleCloseCourse = () => {
		this.props.closeCourse();
		this.handleResetForm();
	};

	handleResetForm = () => {
		this.setState(
			{
				courseStepIdx: 0,
				courseTitleSel: '',
				courseCategorySel: 'IT',
				courseDescrSel: '',
				courseLessonSel: [ '' ],
				coursePriceSel: '0',
				courseThumbSel: null,
				courseInfoSel: ''
			},
			() => {
				this.lessonArr = [ '' ];
			}
		);
	};

	handleNextStep = () => {
		const { data, type } = this.props.coursePopup;
		let {
			courseStepIdx,
			courseTitleSel,
			courseCategorySel,
			courseDescrSel,
			courseLessonSel,
			coursePriceSel,
			courseThumbSel
		} = this.state;
		if (type === 1) {
			courseTitleSel = data[0].Title;
			this.initExistData(data, this.state.courseStepIdx);
		}
		let validate = this.helper.checkValidateCourse(
			courseStepIdx,
			courseTitleSel,
			courseCategorySel,
			courseDescrSel,
			courseLessonSel,
			coursePriceSel,
			courseThumbSel
		);
		if (validate !== '') {
			this.props.showNotice(validate, 0);
			return;
		} else {
			if (this.state.courseStepIdx < this.courseStepLabel.length - 1) {
				this.setState({ courseStepIdx: this.state.courseStepIdx + 1 });
			} else if (this.state.courseStepIdx === this.courseStepLabel.length - 1) {
				if (type === 0) {
					this.callApiCreateCourse();
				} else {
					this.callApiUpdateCourse(data[0].Id);
				}
			}
		}
	};

	callApiCreateCourse = async () => {
		let courseData = new FormData();
		const _courseLesson = this.helper.cvtArrToString(this.state.courseLessonSel);
		courseData.append('CreatorId', this.props.webService.getUserId());
		courseData.append('Name', this.state.courseTitleSel);
		courseData.append('Type', this.state.courseCategorySel);
		courseData.append('Description', this.state.courseDescrSel);
		courseData.append('LessionList', _courseLesson);
		courseData.append('Price', this.state.coursePriceSel);
		courseData.append('Avatar', this.state.courseThumbSel);
		courseData.append('StudyInfor', this.state.courseInfoSel);

		this.setState({ isWaiting: true });
		const resApi = await this.props.webService.createCourse(courseData);
		this.handleCreateCourseApi(resApi);
		this.setState({ isWaiting: false });
	};

	handleCreateCourseApi = (res) => {
		if (res.returnCode === 0) {
			this.props.showNotice(res.returnMess, 0);
		} else {
			this.props.showNotice(res.returnMess, 1);
			this.props.reloadData();
			this.handleResetForm();
		}
	};

	callApiUpdateCourse = async (courseId) => {
		console.log(courseId)
		let courseData = new FormData();
		const _courseLesson = this.helper.cvtArrToString(this.state.courseLessonSel);
		courseData.append('CourseId', courseId);
		courseData.append('Name', this.state.courseTitleSel);
		courseData.append('Type', this.state.courseCategorySel);
		courseData.append('Description', this.state.courseDescrSel);
		courseData.append('LessionList', _courseLesson);
		courseData.append('Price', this.state.coursePriceSel);
		courseData.append('Avatar', this.state.courseThumbSel);
		courseData.append('StudyInfor', this.state.courseInfoSel);

		this.setState({ isWaiting: true });
		const resApi = await this.props.webService.updateCourse(courseData);
		this.handleUpdateCourseApi(resApi);
		this.setState({ isWaiting: false });
	};

	handleUpdateCourseApi = (res) => {
		if (res.returnCode === 0) {
			this.props.showNotice(res.returnMess, 0);
		} else {
			this.props.showNotice(res.returnMess, 1);
			this.props.reloadData();
			this.handleResetForm();
			this.props.closeCourse();
		}
	};

	handleChangeTitle = (e) => {
		this.setState({ courseTitleSel: e.target.value });
	};

	handleChangeCategory = (e) => {
		this.setState({ courseCategorySel: e.target.value });
	};

	handleChangeDescription = (e) => {
		this.setState({ courseDescrSel: e.target.value });
	};

	handleIncreLessCount = () => {
		this.lessonArr.push('');
		this.setState({ courseLessonSel: this.lessonArr });
	};

	handleChangeLesson = (e, index) => {
		if (this.lessonArr[index] !== undefined && this.lessonArr[index] !== null) {
			this.lessonArr[index] = e.target.value;
		}
		this.setState({ courseLessonSel: this.lessonArr });
	};

	handleDeleteLesson = (e, data) => {
		this.lessonArr = this.lessonArr.filter((dt) => {
			return dt !== data;
		});
		this.setState({ courseLessonSel: this.lessonArr });
	};

	handleChangePrice = (e) => {
		if (e.target.value !== '0') this.setState({ coursePriceSel: e.target.value });
	};

	handleChangeThumb = (e) => {
		this.setState({ courseThumbSel: e.target.files[0] });
	};

	handleChangeInfo = (e) => {
		this.setState({ courseInfoSel: e.target.value });
	};

	getStepContent = (index, data, type) => {
		let courseTitleInit = '';
		if (data !== null && data[0] && type === 1) {
			courseTitleInit = data[0].Title;
		}
		switch (index) {
			case 0:
				return courseStepFirst(this.handleChangeTitle, courseTitleInit);
			case 1:
				return courseStepSecond(
					this.courseCategoryLabel,
					this.state.courseCategorySel,
					this.handleChangeCategory,
					this.handleChangeDescription,
					this.state.courseDescrSel
				);
			case 2:
				return courseStepThird(
					this.handleIncreLessCount,
					this.handleChangeLesson,
					this.handleDeleteLesson,
					this.state.courseLessonSel
				);
			case 3:
				return courseStepFour(
					this.handleChangePrice,
					this.handleChangeThumb,
					this.handleChangeInfo,
					this.state.coursePriceSel,
					this.state.courseThumbExits,
					this.state.courseInfoSel
				);
			default:
				return;
		}
	};

	render() {
		const { isShowCourse, type, data } = this.props.coursePopup;
		const { courseStepIdx, isWaiting } = this.state;
		const courseStepLabel = this.courseStepLabel;
		const courseStepTitle = this.courseStepTitle;
		return (
			<div className="hw-modal-course">
				<Dialog
					open={isShowCourse}
					onClose={this.handleCloseCourse}
					aria-labelledby="form-dialog-title"
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle id="form-dialog-title" style={styles.courseModal.dialogTitle}>
						<div>{type === 0 ? <b>Thêm mới khóa học</b> : <b>Cập nhật khóa học</b>}</div>
						<IconButton
							disabled={isWaiting}
							style={styles.courseModal.dialogClose}
							aria-label="Close"
							onClick={this.handleCloseCourse}
						>
							<Close />
						</IconButton>
					</DialogTitle>
					<DialogContent style={styles.courseModal.dialogContent}>
						<DialogContentText color="secondary">
							*Bạn phải hoàn thành 4 bước để hoàn tất việc tạo
						</DialogContentText>
						<div className="course-process">
							<Stepper alternativeLabel activeStep={courseStepIdx} orientation="horizontal">
								{courseStepLabel.map((_, index) => (
									<Step key={courseStepLabel[index]}>
										<StepLabel style={{ fontWeight: 'bold' }}>
											<b>{courseStepLabel[index]}</b>
											<br />
											<b>({courseStepTitle[index]})</b>
										</StepLabel>
									</Step>
								))}
							</Stepper>
							{this.getStepContent(courseStepIdx, data, type)}
						</div>
					</DialogContent>
					<DialogActions>
						{isWaiting && <Loading />}
						<Button disabled={isWaiting} onClick={this.handleCloseCourse} color="primary">
							<b>Đóng</b>
						</Button>
						<Button disabled={isWaiting} variant="contained" color="primary" onClick={this.handleNextStep}>
							<b>{courseStepIdx === courseStepLabel.length - 1 ? 'Kết thúc' : 'Tiếp theo'}</b>
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

const courseStepFirst = (handleChangeTitle, courseTitleInit) => {
	return (
		<div className="course-step-1 course-step-custom">
			<TextField
				variant="outlined"
				autoFocus
				disabled={courseTitleInit !== ''}
				defaultValue={courseTitleInit}
				margin="dense"
				id="nameCourse"
				label="Nhập tiêu đề khoá học"
				type="select"
				onBlur={handleChangeTitle}
				fullWidth
			/>
		</div>
	);
};

const courseStepSecond = (
	courseCategoryLabel,
	courseCategorySel,
	handleChangeCategory,
	handleChangeDescription,
	courseDescrInit
) => {
	return (
		<div className="course-step-2">
			<TextField
				variant="outlined"
				autoFocus
				select
				margin="dense"
				id="cateCourse"
				label="Nhập loại khoá học"
				type="text"
				value={courseCategorySel}
				onChange={handleChangeCategory}
				fullWidth
			>
				{courseCategoryLabel.map((option) => (
					<MenuItem key={option} value={option}>
						{option}
					</MenuItem>
				))}
			</TextField>
			<TextField
				variant="outlined"
				multiline
				rows="4"
				margin="dense"
				id="descrCourse"
				label="Nhập mô tả khoá học"
				type="text"
				defaultValue={courseDescrInit}
				onBlur={handleChangeDescription}
				fullWidth
			/>
		</div>
	);
};

const courseStepThird = (handleIncreLessCount, handleChangeLesson, handleDeleteLesson, courseLessonSel, courseType) => {
	return (
		<div className="course-step-3">
			{courseLessonSel.map((data, index) => {
				return (
					<TextField
						key={index}
						variant="outlined"
						autoFocus
						defaultValue={data}
						margin="dense"
						id="lessonCourse"
						label="Nhập bài học khoá học"
						type="text"
						InputProps={
							index > 0 ? (
								{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="Toggle password visibility"
												onClick={(e, _data = data) => handleDeleteLesson(e, _data)}
											>
												<Clear />
											</IconButton>
										</InputAdornment>
									)
								}
							) : null
						}
						onBlur={(e, _index = index) => handleChangeLesson(e, _index)}
						fullWidth
					/>
				);
			})}
			<Button size="medium" color="secondary" variant="outlined" onClick={handleIncreLessCount}>
				<b>Thêm bài học</b>
			</Button>
		</div>
	);
};

const courseStepFour = (
	handleChangePrice,
	handleChangeThumb,
	handleChangeInfo,
	coursePriceSel,
	courseThumbExits,
	courseInfoSel
) => {
	return (
		<div className="course-step-4">
			<TextField
				label="Nhập giá tiền khoá học"
				autoFocus
				defaultValue={coursePriceSel}
				id="priceCourse"
				onBlur={handleChangePrice}
				fullWidth
				margin="dense"
				variant="outlined"
				InputProps={{
					inputComponent: coursePriceFormat,
					endAdornment: (
						<InputAdornment position="end">
							<i className="far fa-money-bill-alt fa-2x" />
						</InputAdornment>
					)
				}}
			/>
			<TextField
				variant="outlined"
				margin="dense"
				id="avatarCourse"
				label="Tải ảnh đại diện"
				type="file"
				InputLabelProps={{
					shrink: true
				}}
				onBlur={handleChangeThumb}
				fullWidth
			/>
			<Typography variant="subtitle1">Ảnh đã tạo: {courseThumbExits}</Typography>
			<TextField
				variant="outlined"
				margin="dense"
				defaultValue={courseInfoSel}
				id="infoCourse"
				label="Nhập thông tin khóa học"
				type="text"
				onBlur={handleChangeInfo}
				fullWidth
			/>
		</div>
	);
};

const coursePriceFormat = (props) => {
	const { inputRef, onChange, ...other } = props;
	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			maxLength={9}
			onValueChange={(values) => {
				onChange({
					target: {
						value: values.value
					}
				});
			}}
			thousandSeparator
		/>
	);
};

const styles = {
	courseModal: {
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

coursePriceFormat.propTypes = {
	inputRef: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	coursePopup: state.coursePopup
});

export default connect(mapStateToProps, actions)(ModalCourse);
