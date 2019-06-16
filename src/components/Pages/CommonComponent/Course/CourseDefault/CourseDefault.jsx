import React, { Component } from 'react';
import './CourseDefault.css';
import { connect } from 'react-redux';
import { Breadcrumbs } from '@material-ui/lab';
import {  MuiThemeProvider } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
	Avatar,
	Button,
	Chip,
	Divider,
	ListItemSecondaryAction,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Typography,
	Icon,
	AppBar,
	Tabs,
	Tab,
	Paper,
	Link,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails
} from '@material-ui/core';
import * as actions from '../../../../../actions';
import { INPUT_MU } from '../../../../../setting/ThemeUiConfig';
import sampleCourse from '../../../../../assets/images/pic/vue.jpeg';
import sample from '../../../../../assets/images/pic/hw-homepage-sample.jpg';

import CourseListItem from '../../../CommonComponent/Course/CourseListItem';
import WebService from '../../../../../services/WebService';

const styles = {
	header: {
		color: '#FFFFFF',
		fontSize: '1em',
		fontWeight: 'bold'
	},

	button: {
		color: '#FFFFFF',
		fontSize: '1em',
		padding: '6px 24px',
		fontWeight: 'bold',
		margin: '0px 10px'
	},

	price: {
		color: '#FFFFFF',
		fontSize: '2em',
		fontWeight: 'bold'
	},
	root: {
		justifyContent: 'center',
		flexWrap: 'wrap'
	},
	paper: {
		padding: '5px'
	}
};

class CourseDefault extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabIdx: 0
		};
		this.webService = new WebService();
	}

	componentDidMount() {
		this.props.setTitle('Chi Tiết Khoá Học');
	}
	handleChangeTab = (event, index) => {
		this.setState({ tabIdx: index });
	};

	hanldeJoinCourse = () => {
		this.callApiRequestJoinCourse(this.props.courseDetailData.CourseId);
	};

	callApiRequestJoinCourse = async (courseId) => {
		const resApi = await this.webService.requestJoinCourse(courseId);
		this.handleRequestJoinCourseApi(resApi);
	};

	handleRequestJoinCourseApi = (resApi) => {
		if (resApi.returnCode === 0) {
			this.props.showNotice(resApi.returnMess, 0);
		} else {
			this.props.showNotice(resApi.returnMess, 1);
			this.props.reloadData();
		}
	};

	render() {
		const { classes, theme } = this.props;
		const courseDetail = this.props.courseDetailData;
		return (
			<MuiThemeProvider theme={INPUT_MU}>
				<div className="course-detail-default container">
					<div>{BreadcrumbBar()}</div>
					<div className="course-default-header">
						<div className="row d-flex justify-content-center align-items-flex-start">
							<div
								className="col-sm-12 col-md-6 col-lg-6 col-xl-6 course-default-header-img"
								style={{ textAlign: 'center' }}
							>
								<img src={sampleCourse} alt="" />
							</div>
							{CourseBanner(this.hanldeJoinCourse, courseDetail.Permission)}
						</div>
					</div>
					{CourseSubMenu(this.state.tabIdx, this.handleChangeTab)}
					<div>
						<Paper id="info1" className="paper-card">
							<Typography variant="h5" component="h3" style={{ color: 'white' }} className="title-bar">
								Thông tin khoá học
							</Typography>
							{CourseSubInfo()}
							<ExpansionPanel style={{ margin: '1px 0' }}>
								<ExpansionPanelSummary style={{ paddingLeft: '10px' }} expandIcon={<ExpandMoreIcon />}>
									<Typography variant="h6" component="p">
										Mô tả
									</Typography>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<Typography>
										Flexbox can do some pretty awesome things when you mix flex alignments with auto
										margins. Shown below are three examples of controlling flex items via auto
										margins: default (no auto margin), pushing two items to the right (.mr-auto),
										and pushing two items to the left (.ml-auto). Unfortunately, IE10 and IE11 do
										not properly support auto margins on flex items whose parent has a non-default
										justify-content value. See this StackOverflow answer for more details.
									</Typography>
								</ExpansionPanelDetails>
							</ExpansionPanel>
							<ExpansionPanel style={{ margin: '1px 0' }}>
								<ExpansionPanelSummary style={{ paddingLeft: '10px' }} expandIcon={<ExpandMoreIcon />}>
									<Typography variant="h6" component="p">
										Yêu cầu
									</Typography>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<Typography>
										Flexbox can do some pretty awesome things when you mix flex alignments with auto
										margins. Shown below are three examples of controlling flex items via auto
										margins: default (no auto margin), pushing two items to the right (.mr-auto),
										and pushing two items to the left (.ml-auto). Unfortunately, IE10 and IE11 do
										not properly support auto margins on flex items whose parent has a non-default
										justify-content value. See this StackOverflow answer for more details.
									</Typography>
								</ExpansionPanelDetails>
							</ExpansionPanel>
						</Paper>
						<Paper id="info2" className="paper-card">
							<Typography variant="h5" component="h3" style={{ color: 'white' }} className="title-bar">
								Bạn sẽ được học
							</Typography>
							{CourseContent()}
						</Paper>

						<Paper id="info3" className="paper-card">
							<Typography variant="h5" component="h3" style={{ color: 'white' }} className="title-bar">
								Thông tin giảng viên
							</Typography>
							<div className="d-flex flex-row">
								<div className="col-md-3 teacher-card-left">
									<Avatar
										alt="Remy Sharp"
										src={sample}
										style={{ width: '120px', height: '120px', border: '2px solid #02bf99' }}
									/>
									<Chip
										label={
											<Typography variant="body1" component="h5" style={{ color: 'white' }}>
												<b> Teacher Name</b>
											</Typography>
										}
										className="my-2"
										style={{ border: '1px solid #02bf99', background: 'gray' }}
									/>
								</div>
								<div className="col-md-9 teacher-card-right">
									<Typography variant="h5" component="h5">
										<i className="fas fa-chalkboard-teacher" />
										<b> Teacher Name</b>
									</Typography>
									<Typography component="h5" variant="subtitle1" gutterBottom>
										<i className="fas fa-envelope" /> <b>Email:</b>{' '}
										<a href="mailto:teachermail@gmail.com">teachermail@gmail.com</a>
									</Typography>
									<Typography component="h5" variant="subtitle1" gutterBottom>
										<i className="fas fa-phone" /> <b>Phone:</b> 012345678
									</Typography>
									<Typography component="h5" variant="subtitle1" gutterBottom>
										<b>Mô tả:</b>
									</Typography>
									<Typography component="body1" variant="subtitle1" gutterBottom>
										Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula
										eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient
										montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque
										eu, pretium quis, sem.
									</Typography>
								</div>
							</div>
						</Paper>

						<Paper id="info4" className="paper-card">
							<Typography variant="h5" component="h3" style={{ color: 'white' }} className="title-bar">
								Ratings & Reviews
							</Typography>
							<div className="row mt-4">
								<div className="col-md-4 col-sm-12 col-12">{RatingSection()}</div>
								<div className="col-md-1 col-sm-12 col-12 justify-content-center d-flex">
									<div style={{ width: '2px', background: '#e7eaec' }}> </div>
								</div>
								<div className="col-md-7 col-sm-12 col-12">
									<Typography component="h3" variant="headline" className="pl-2">
										Reviews
									</Typography>
									{ReviewList()}
								</div>
							</div>
						</Paper>

						<Paper className="paper-card">
							<Typography variant="h5" component="h3" style={{ color: 'white' }} className="title-bar">
								Related Courses
							</Typography>
							<div className="hw-course-list-item row related-course">
								{/* {[ 1, 2, 3 ].map((_, index) => {
									return <CourseListItem key={index} />;
								})} */}
							</div>
						</Paper>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

function handleClickBreadcrumb(event) {
	event.preventDefault();
	alert('You clicked a breadcrumb.'); // eslint-disable-line no-alert
}

function handleClickChip() {
	alert('You clicked the Chip.'); // eslint-disable-line no-alert
}

const BreadcrumbBar = () => {
	return (
		<Paper className="breadcrumb-nav">
			<Breadcrumbs separator={<NavigateNextIcon />} arial-label="Breadcrumb">
				<Link color="inherit" href="/" onClick={handleClickBreadcrumb}>
					<b>Material-UI</b>
				</Link>
				<Link color="inherit" href="/lab/about/" onClick={handleClickBreadcrumb}>
					Lab
				</Link>
				<Typography color="textPrimary">Breadcrumb</Typography>
			</Breadcrumbs>
		</Paper>
	);
};

const CourseSubInfo = () => {
	const title = [ 'Số chủ đề:', 'Ngôn ngữ:', 'Video:', 'Live support:' ];
	const info = [ '20', 'Tiếng Anh', '8 tiếng', 'Có' ];
	return (
		<List component="ul" style={{ padding: '0' }}>
			{info.map((_, index) => {
				return (
					<ListItem key={index} divider dense={true}>
						<ListItemText
							primary={
								<Typography type="h5">
									<b>{title[index]}</b>
								</Typography>
							}
							dens
						/>
						<ListItemSecondaryAction>
							<ListItemText
								primary={
									<Typography type="body1">{info[index]}</Typography>
								}
							/>
						</ListItemSecondaryAction>
					</ListItem>
				);
			})}
		</List>
	);
};

const CourseContent = () => {
	const info = [
		'Learn to use Python professionally, learning both Python 2 and Python 3!',
		'Create games with Python, like Tic Tac Toe and Blackjack!',
		'Learn advanced Python features, like the collections module and how to work with timestamps!',
		'Learn to use Object Oriented Programming with classes!'
	];
	return (
		<List component="ul" className="row d-flex justify-content-center flex-wrap">
			{info.map((_, index) => {
				return (
					<ListItem style={{ padding: '10px' }} key={index}>
						<Icon className="fas fa-check" style={{ color: '#02bf99' }} />
						<ListItemText primary={info[index]} />
					</ListItem>
				);
			})}
		</List>
	);
};

const StarRating = (rate) => {
	return (
		<div className="hw-star-rating-custom">
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

const CourseBanner = (hanldeJoinCourse, permission) => {
	return (
		<div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 course-default-header-img hw-color-white ">
			<h3> Build Web Apps with Vue JS 2 & Firebase</h3>
			<div className="d-flex">
				<div>
					<Chip
						avatar={<Avatar alt="ava" src={sample} />}
						label="Nguyễn Khoa Phạm"
						variant="outlined"
						style={styles.header}
						onClick={handleClickChip}
					/>
				</div>
				<div className="ml-auto d-flex justify-content-end flex-wrap">
					{StarRating(4)}
					<span className="d-flex align-items-center ml-2 "> 4.0 (5 ratings)</span>
				</div>
			</div>
			<div className="mt-2">
				<Typography type="body1" style={styles.header}>
					Learn Python like a Professional! Start from the basics and go all the way to creating your own
					applications and games!
				</Typography>
			</div>
			<div className="d-flex justify-content-end mt-auto">
				<Typography type="h3" style={styles.price}>
					Giá: 2.000.000đ
				</Typography>
			</div>
			<div className="d-flex justify-content-end flex-wrap">
				<Button
					variant="contained"
					color="primary"
					style={styles.button}
					className="my-2"
					onClick={hanldeJoinCourse}
					disabled={permission && permission === 2}
				>
					{permission && permission === 2 ? 'Đang chờ xét duyệt' : 'Tham gia khoá học'}
				</Button>
				{/* <Button variant="outlined" color="inherit" style={styles.button} className = "my-2">
					Thêm vào giỏ
				</Button> */}
			</div>
		</div>
	);
};

const CourseSubMenu = (tabIdx, handleChangeTab) => {
	return (
		<div>
			<AppBar position="static" color="default" style={{ color: 'red' }}>
				<Tabs
					value={tabIdx}
					onChange={handleChangeTab}
					indicatorColor="primary"
					textColor="primary"
					variant="fullWidth"
				>
					<Tab
						style={{ fontWeight: 'bold' }}
						label={
							<a href="#info1" style={{ textDecoration: 'none', color: 'inherit' }}>
								Thông tin chung
							</a>
						}
					/>
					<Tab
						style={{ fontWeight: 'bold' }}
						label={
							<a href="#info2" style={{ textDecoration: 'none', color: 'inherit' }}>
								Giáo trình
							</a>
						}
					/>
					<Tab
						style={{ fontWeight: 'bold' }}
						label={
							<a href="#info3" style={{ textDecoration: 'none', color: 'inherit' }}>
								Giảng viên
							</a>
						}
					/>
					<Tab
						style={{ fontWeight: 'bold' }}
						label={
							<a href="#info4" style={{ textDecoration: 'none', color: 'inherit' }}>
								Review
							</a>
						}
					/>
				</Tabs>
			</AppBar>
		</div>
	);
};

const RatingSection = () => {
	const rate = [ 53, 23, 20, 4, 0 ];
	return (
		<div className="course-rating-container">
			<div className="course-rating-summary-left">
				<Typography component="h2" variant="display3" align="center">
					4.0
				</Typography>
				<div className="d-flex justify-content-center"> {StarRating(4)} </div>
				<Typography variant="subheading" align="center">
					(69 lượt đánh giá)
				</Typography>
			</div>

			<div className="course-rating-summary-right">
				{rate.map((_, index) => {
					return (
						<Button className="course-rating-bar-row">
							<div className="course-rating-bar-gauge">
								<div className="course-rating-bar-bg">
									<span className="course-rating-bar-fill" style={{ width: rate[index] + '%' }} />
								</div>
							</div>
							{StarRating(5 - index)}
							<Typography component="p" align="center" className="pl-2" style={{ width: '35px' }}>
								{rate[index]}%
							</Typography>
						</Button>
					);
				})}
			</div>
		</div>
	);
};

const ReviewList = () => {
	return (
		<List>
			{[ 1, 2, 3, 4, 5 ].map((_, index) => {
				return (
					<div>
						<ListItem alignItems="flex-start">
							<ListItemAvatar>
								<Avatar alt="Remy Sharp" src={sample} style={{ margin: '1em' }} />
							</ListItemAvatar>
							<ListItemText
								className="review-content"
								primary={
									<div className="d-flex pt-2">
										<Typography variant="body1" className="mr-auto font-weight-bold mr-2">
											Username
										</Typography>
										<Typography variant="body2" className="font-weight-light text-secondary">
											5 hours ago
										</Typography>
									</div>
								}
								secondary={
									<div>
										{StarRating(1)}
										<Typography variant="body1" className="pt-2">
											Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
											ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis
											parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
											pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
										</Typography>
									</div>
								}
							/>
						</ListItem>
						{index !== 4 && <Divider />}
					</div>
				);
			})}
		</List>
	);
};

export default connect(null, actions)(CourseDefault);
