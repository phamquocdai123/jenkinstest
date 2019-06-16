import React, { Component } from 'react';
import './CourseDetail.css';
import { connect } from 'react-redux';

import WebService from '../../../../services/WebService';
import * as actions from '../../../../actions';

import CourseEnroll from '../../CommonComponent/Course/CourseEnroll';
import CourseDefault from '../../CommonComponent/Course/CourseDefault';

class CourseDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			courseDetail: {},
			courseState: -1,
			userPer: null,
			isCourseDetail: false,

		};
		this.webService = new WebService();
	}

	componentWillMount() {
		this.props.setTitle('Chi Tiết Khoá Học');
		this.callApiGetCourseDetail();
	}

	callApiGetCourseDetail = async () => {
		const courseId = this.props.match.params.id;
		const resApi = await this.webService.getCourseDetail(courseId);
		this.handleGetDetailCourseApi(courseId,resApi);
	};

	handleGetDetailCourseApi = (courseId,resApi) => {
		console.log(resApi)
		if (resApi.returnCode === 0) {
			this.props.showNotice(resApi.returnMess, 0);
		} else {
			const result = resApi.data;
			const courseDetail = {
				AmountStudent: result.AmountStudent,
				Permission: result.Permission,
				CourseId: courseId,
				Avatar: result.Avatar,
				Code: result.Code,
				CreateDate: result.CreateDate,
				Creator: result.Creator,
				Description: result.Description,
				Id: result.Id,
				LessionList: result.LessionList,
				Name: result.Name,
				Price: result.Price,
				Rating: result.Rating,
				StudyInfor: result.StudyInfor,
				Type: result.Type,
				Title: result.Title,
			};
			this.setState({ courseDetail: courseDetail, userPer: result.Permission, isCourseDetail: true, courseState: resApi.returnCode });
		}
	};

	handleReloadData = () => {
		this.callApiGetCourseDetail();
	}

	render() {
		const { isCourseDetail, courseDetail, courseState, userPer } = this.state;
		return (
			<div className="hw-course-detail">
				{isCourseDetail === true ? (
					<div className="hw-course-detail-policy">
						{userPer !== 0 && userPer !== 1 ? (
						<CourseDefault courseDetailData={courseDetail} courseState={courseState} reloadData={this.handleReloadData}/>
						) : (
							<CourseEnroll courseDetailData={courseDetail} />
						)}
					</div>
				) : (
					<div className="hw-course-detail-notice">Khoá học bạn đang tìm không có</div>
				)}
			</div>
		);
	}
}

export default connect(null, actions)(CourseDetail);
