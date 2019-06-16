import React, { Component } from 'react';
import './HomePage.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Fab, Typography, Avatar } from '@material-ui/core';
// import Slider from 'react-slick';

import CourseListItem from '../../CommonComponent/Course/CourseListItem';

import * as actions from '../../../../actions';
import { SLIDE_CONFIG } from '../../../../setting/ConstantConfig';

import sample from '../../../../assets/images/pic/hw-homepage-sample.jpg';
import sample1 from '../../../../assets/images/pic/hw-homepage-sample1.jpg';
import banner from '../../../../assets/images/pic/hw-home-ele.png';
import divider from '../../../../assets/images/pic/hw-divider.png';
import eduIco from '../../../../assets/images/ico/homepage-ico1.svg';
import streanIco from '../../../../assets/images/ico/homepage-ico2.svg';
import examIco from '../../../../assets/images/ico/homepage-ico3.svg';
import timeIco from '../../../../assets/images/ico/homepage-ico4.svg';
import WebService from '../../../../services/WebService';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.webService = new WebService();
		this.state = {
			currIndex: 0,
			topCourse: []
		};
	}

	componentDidMount() {
		this.props.removeTitle();
		this.callApiGetTopCourse();
	}

	callApiGetTopCourse = async () => {
		const resApi = await this.webService.getTopCourse();
		this.handleGetTopCourseApi(resApi);
	};

	handleGetTopCourseApi = (resApi) => {
		if (resApi.returnCode === 0) {
			this.props.showNotice(resApi.returnMess, 0);
		} else {
			const result = resApi.data;
			this.setState({ topCourse: result });
		}
	};

	handleCusItemNext = () => {
		if (this.state.currIndex < 2) {
			this.setState({ currIndex: this.state.currIndex + 1 });
		} else {
			this.setState({ currIndex: 0 });
		}
	};

	handleCusItemPre = () => {
		if (this.state.currIndex > 0) {
			this.setState({ currIndex: this.state.currIndex - 1 });
		} else {
			this.setState({ currIndex: 2 });
		}
	};

	handleGoToCourse = () => {
		this.props.history.push('/khoa-hoc');
	};

	handleGoToAbout = () => {
		this.props.history.push('/about');
	};

	render() {
		const { currIndex, topCourse } = this.state;
		const customerData = [
			{
				img: sample,
				name: 'John',
				cmt: 'Các lớp học cực kì chất lượng'
			},
			{
				img: sample,
				name: 'John1',
				cmt: 'Các lớp học cực kì chất lượng'
			},
			{
				img: sample,
				name: 'John2',
				cmt: 'Các lớp học cực kì chất lượng'
			}
		];
		return (
			<div className="hw-homepage">
				{HomePageTop(this.handleGoToCourse, this.handleGoToAbout)}
				<div className="hw-homepage-body">
					<div className="hw-homepage-body-title">
						<Typography component="h2" variant="h2" gutterBottom>
							HỌC{'\u00A0'}
						</Typography>
						<Typography color="secondary" component="h2" variant="h2" gutterBottom>
							TRỰC TUYẾN
						</Typography>
					</div>
					<div className="hw-divider">
						<img src={divider} alt="" />
					</div>
					{BenefitItems()}
					<div className="hw-homepage-body-quality">
						<div className="hw-homepage-body-quality-cus">
							<div className="homepage-body-quality-cus-title container">
								<Typography component="h2" variant="h2" style={{ color: 'white' }} gutterBottom>
									HỌC VIÊN{'\u00A0'}
								</Typography>
								<Typography color="secondary" component="h2" variant="h2" gutterBottom>
									NÓI GÌ ?
								</Typography>
							</div>
							<div className="hw-divider">
								<img src={divider} alt="" />
							</div>
							<div className="homepage-body-quality-cus-slide hw-center-column container">
								<div className="quality-carousel-custom">
									<div className="carousel-pre" onClick={this.handleCusItemPre}>
										<i className="fas fa-angle-left fa-2x" />
									</div>
									<div className="carousel-items hw-center-row">
										{customerData.map((_customerData, index) => {
											return CustomerItem(index, currIndex, _customerData);
										})}
									</div>
									<div className="carousel-next" onClick={this.handleCusItemNext}>
										<i className="fas fa-angle-right fa-2x" />
									</div>
								</div>
								<div className="quality-idicator-custom hw-center-row">
									{customerData.map((_, index) => {
										return (
											<span
												key={index}
												className={
													currIndex != null && currIndex === index ? (
														'quality-idicator-active'
													) : (
														'quality-idicator'
													)
												}
											/>
										);
									})}
								</div>
							</div>
						</div>
					</div>
					<div className="hw-homepage-body-course container">
						<div className="hw-homepage-body-course-title">
							<Typography component="h2" variant="h2" gutterBottom>
								KHOÁ HỌC{'\u00A0'}
							</Typography>
							<Typography color="secondary" component="h2" variant="h2" gutterBottom>
								CHẤT LƯỢNG
							</Typography>
						</div>
						<div className="hw-divider">
							<img src={divider} alt="" />
						</div>
						<div className="hw-homepage-body-course-list hw-center-row">
							<div style={{ maxWidth: '1400px' }}>
								{/* {topCourse &&
								topCourse.length > 0 && (
									<Slider {...SLIDE_CONFIG}>
										{topCourse.map((data, index) => {
											return (
												<div className="hw-item-slide" key={index}>
													<CourseListItem courseData={data} component="home" />
												</div>
											);
										})}
									</Slider>
								)} */}
							</div>
						</div>
					</div>
					<div className="hw-homepage-body-employee">
						<div className="hw-homepage-body-employee-title">
							<Typography component="h2" variant="h2" style={{ color: 'white' }} gutterBottom>
								GIÁO VIÊN{'\u00A0'}
							</Typography>
							<Typography color="secondary" component="h2" variant="h2" gutterBottom>
								ƯU TÚ
							</Typography>
						</div>
						<div className="hw-divider">
							<img src={divider} alt="" />
						</div>
						<div className="hw-homepage-body-employee-list">
							{[ 1, 2, 3 ].map((_, index) => {
								return EmployeeItem(index);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const HomePageTop = (handleGoToCourse, handleGoToAbout) => {
	return (
		<div className="hw-homepage-top">
			<div className="hw-homepage-top-ele">
				<img src={banner} alt="" />
			</div>
			<div className="hw-homepage-top-more">
				<div className="hw-homepage-top-typo d-flex flex-column">
					<div className="d-flex">
						<Typography component="h2" variant="h2" gutterBottom>
							VIỆC{'\u00A0'}
						</Typography>
						<Typography color="secondary" component="h2" variant="h2" gutterBottom>
							{'\u00A0'}HỌC
						</Typography>
					</div>
					<div className="hw-divider">
						<img src={divider} alt="" />
					</div>
					<div>
						<Typography align="center" component="h2" variant="h4" gutterBottom>
							CHƯA BAO GIỜ
						</Typography>
						<Typography align="center" component="h2" variant="h4" gutterBottom>
							DỄ ĐẾN THẾ
						</Typography>
					</div>
				</div>
				<div className="hw-homepage-top-btn">
					<Fab
						variant="extended"
						size="medium"
						color="secondary"
						aria-label="More"
						className="hw-homepage-top-more-btn"
						onClick={handleGoToCourse}
					>
						Xem Các Lớp Học
					</Fab>
					<Fab
						variant="extended"
						size="medium"
						color="primary"
						aria-label="More"
						className="hw-homepage-top-more-btn"
						onClick={handleGoToAbout}
					>
						Xem thêm Về CHúng Tôi
					</Fab>
				</div>
			</div>
		</div>
	);
};

const BenefitItems = () => {
	return (
		<div className="hw-homepage-body-ico hw-center-row">
			<div className="hw-homepage-body-ico-edu d-flex">
				<img src={eduIco} className="homepage-ico" alt="eduIco" />
				<div className="content">
					<Typography style={{ fontWeight: 800 }} component="h4" variant="h5">
						Các lớp học
					</Typography>
					<Typography component="h5" variant="subtitle1">
						Các lớp học được tạo bởi người dùng, được sử dụng và quản lý hiểu quả
					</Typography>
				</div>
			</div>
			<div className="hw-homepage-body-ico-stream d-flex">
				<img src={streanIco} className="homepage-ico" alt="streanIco" />
				<div className="content">
					<Typography style={{ fontWeight: 800 }} component="h4" variant="h5">
						Học trực tuyến
					</Typography>
					<Typography component="h5" variant="subtitle1">
						Học trực tuyến ngay trên web, app hoặc ở bất kì nơi đâu, bất kì khi nào
					</Typography>
				</div>
			</div>
			<div className="hw-homepage-body-ico-exam d-flex">
				<img src={examIco} className="homepage-ico" alt="examIco" />
				<div className="content">
					<Typography style={{ fontWeight: 800 }} component="h4" variant="h5">
						Bài đa dạng
					</Typography>
					<Typography component="h5" variant="subtitle1">
						Sự đa dạng về chủ đề đến từ sự đa dạng về mong muốn của học viên
					</Typography>
				</div>
			</div>
			<div className="hw-homepage-body-ico-time d-flex">
				<img src={timeIco} className="homepage-ico" alt="timeIco" />
				<div className="content">
					<Typography style={{ fontWeight: 800 }} component="h4" variant="h5">
						Lịch chủ động
					</Typography>
					<Typography component="h5" variant="subtitle1">
						Lịch học được thống nhất giữa giảng viên và học viên tùy theo lịch riêng của mỗi người.
					</Typography>
				</div>
			</div>
		</div>
	);
};

const CustomerItem = (index, currIndex, data) => {
	return (
		<div key={index}>
			{currIndex !== null && index === currIndex ? (
				<div className="carousel-items-detail animated bounceIn">
					<Avatar
						alt=""
						src={data.img}
						style={{
							width: '90px',
							height: '90px',
							marginBottom: '1em'
						}}
					/>
					<h4>{data.name}</h4>
					<p>{data.cmt}</p>
				</div>
			) : null}
		</div>
	);
};

const EmployeeItem = (index) => {
	return (
		<div key={index} className="hw-homepage-body-employee-item">
			<img src={sample1} alt="" className="hw-homepage-body-employee-img" />
			<div className="hw-homepage-body-employee-info">
				<div className="employee-info-contact">
					<i className="fab fa-facebook-square fa-2x employee-info-contact-ico" />
					<i className="fab fa-twitter-square fa-2x employee-info-contact-ico" />
					<i className="fas fa-envelope-square fa-2x employee-info-contact-ico" />
				</div>
				<div className="employee-info-detail">
					<h4 className="employee-info-name">William Holow</h4>
					<h5 className="employee-info-job">Giáo viên dạy toán</h5>
				</div>
			</div>
		</div>
	);
};

export default withRouter(connect(null, actions)(HomePage));
