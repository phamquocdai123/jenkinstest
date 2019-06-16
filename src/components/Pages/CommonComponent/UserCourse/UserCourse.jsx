import React, { Component } from 'react';
import './UserCourse.css';
import { Typography } from '@material-ui/core';

import Loading from '../Other/Loading';
import CourseListItem from '../Course/CourseListItem';

import WebService from '../../../../services/WebService';

class UserCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseEnroll: [],
      isWaiting: false
    }
    this.webService = new WebService();
  }

  componentDidMount() {
    this.callApiGetEnrollCourse();
  }

  callApiGetEnrollCourse = async () => {
    this.setState({ isWaiting: true });
    const resApi = await this.webService.getEnrollCourseList();
    this.handleGetEnrollCourseApi(resApi);
    this.setState({ isWaiting: false });
  }

  handleGetEnrollCourseApi = (res) => {
    if (res.returnCode === 0) {
      this.props.showNotice(res.returnMess, 0);
    } else {
      const result = res.data;
      this.setState({ courseEnroll: result });
    }
  }

  render() {
    const { courseEnroll, isWaiting } = this.state;
    return (
      <div className="hw-user-course d-flex justify-content-center">
        <div className="container">
          <div className="user-course-action">
            <Typography component="h5" variant="h6">
              Các khóa học tham gia
            </Typography>
            {isWaiting && <Loading />}
            <div className="hw-course-list-item row">
              {courseEnroll.map((data, index) => {
                return (
                  <CourseListItem courseData={data}/>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserCourse;
