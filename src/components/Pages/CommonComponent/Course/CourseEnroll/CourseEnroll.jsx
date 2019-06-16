import React, { Component } from "react";
import "./CourseEnroll.css";
import { connect } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Button
} from "@material-ui/core";
import { OndemandVideo } from "@material-ui/icons";

import * as actions from "../../../../../actions";
import { INPUT_MU } from "../../../../../setting/ThemeUiConfig";

import CourseStuInfo from "../../../Student/CourseStuInfo";
import CourseStuStream from "../../../Student/CourseStuStream";
import CourseStuDeadline from "../../../Student/CourseStuDeadline";
import CourseTeaStream from "../../../Teacher/CourseTeaStream";
import CourseTeaDeadline from "../../../Teacher/CourseTeaDeadline";
import CourseTeaRequest from "../../../Teacher/CourseTeaRequest";
import CourseTeaManage from "../../../Teacher/CourseTeaManage";

import sampleCourse from "../../../../../assets/images/pic/vue.jpeg";
import WebService from "../../../../../services/WebService";

const styles = {
  header: {
    color: "#FFFFFF",
    fontSize: "1em",
    fontWeight: "bold"
  }
};

class CourseEnroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabStuIdx: 0,
      tabTeaIdx: 0,
      subInfo: []
    };
    this.webService = new WebService();
    this.coursePermission = null;
  }

  componentWillMount() {
    this.handleCoursePermission();
    this.initData();
  }

  componentDidMount() {
    this.createCourseSubInfo();
  }

  initData = () => {
    const currStuIdx = sessionStorage.getItem("currIdx");
    if (currStuIdx !== null && currStuIdx !== undefined && currStuIdx !== "") {
      this.setState({ tabStuIdx: Number(currStuIdx) }, () => {
        sessionStorage.removeItem("currIdx");
      });
    }
  };

  handleCoursePermission = () => {
    const courseDetailData = this.props.courseDetailData;
    this.coursePermission = courseDetailData.Permission;
  };

  createCourseSubInfo = () => {
    const courseDetailData = this.props.courseDetailData;
    let subInfoTemp = [];
    subInfoTemp.push(courseDetailData.Name);
    subInfoTemp.push(courseDetailData.AmountStudent);
    subInfoTemp.push(courseDetailData.Type);
    subInfoTemp.push(courseDetailData.Description);
    this.setState({ subInfo: subInfoTemp });
  };

  handleChangeStuTab = (event, index) => {
    this.setState({ tabStuIdx: index });
  };

  handleChangeTeaTab = (event, index) => {
    this.setState({ tabTeaIdx: index });
  };

  handleLiveTeaClick = () => {
    this.setState({ isLive: true });
  };

  handleCloseLive = () => {
    this.setState({ isLive: false });
  };

  render() {
    const courseDetailData = this.props.courseDetailData;
    const { tabStuIdx, tabTeaIdx, subInfo, isLive } = this.state;
    return (
      <MuiThemeProvider theme={INPUT_MU}>
        <div className="course-detail-enroll container">
          <div className="course-enroll-header">
            <div className="row d-flex justify-content-center align-items-center">
              <div
                className="col-sm-12 col-md-6 col-lg-6 col-xl-6 course-enroll-header-img"
                style={{ textAlign: "center" }}
              >
                <img src={sampleCourse} alt="" />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 course-enroll-header-img hw-color-white">
                <h4>{courseDetailData.Title}</h4>
                {StarRating(courseDetailData.Rating)}
                {CourseSubInfo(
                  subInfo,
                  this.coursePermission,
                  this.handleLiveTeaClick
                )}
              </div>
            </div>
          </div>
          <div className="">
            {this.coursePermission !== null && this.coursePermission === 0
              ? StudentCourse(
                  tabStuIdx,
                  this.handleChangeStuTab,
                  courseDetailData
                )
              : TeacherCourse(
                  tabTeaIdx,
                  isLive,
                  this.handleChangeTeaTab,
                  this.handleCloseLive,
                  courseDetailData
                )}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const CourseSubInfo = (subInfo, coursePermission, handleLiveTeaClick) => {
  const subTitle = ["Giáo viên:", "Số học sinh tham gia:", "Loại:", "Mô tả:"];
  return (
    <List component="ul">
      {subTitle.map((_, index) => {
        return (
          <ListItem key={index} divider dense={true}>
            <ListItemText
              primary={
                <Typography type="body1" style={styles.header}>
                  {subTitle[index]}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <ListItemText
                primary={
                  <Typography type="body1" style={styles.header}>
                    {subInfo[index]}
                  </Typography>
                }
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
      {coursePermission !== null && coursePermission === 1 && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLiveTeaClick}
        >
          <OndemandVideo />
          <b style={{ marginLeft: "0.5em", marginRight: "0.5em" }}>
            Phát trực tuyến
          </b>
        </Button>
      )}
    </List>
  );
};

const StudentCourse = (tabIdx, handleChangeTab, courseDetailData) => {
  return (
    <div>
      <AppBar position="static" color="default" style={{ color: "red" }}>
        <Tabs
          value={tabIdx}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab style={{ fontWeight: "bold" }} label="Tổng quan" />
          <Tab style={{ fontWeight: "bold" }} label="Live stream" />
          <Tab style={{ fontWeight: "bold" }} label="Q&A" />
          <Tab style={{ fontWeight: "bold" }} label="Bài tập" />
        </Tabs>
      </AppBar>

      {tabIdx === 0 ? (
        <CourseStuInfo courseDetailData={courseDetailData} />
      ) : null}
      {tabIdx === 1 ? (
        <CourseStuStream courseDetailData={courseDetailData} />
      ) : null}
      {tabIdx === 3 ? (
        <CourseStuDeadline courseDetailData={courseDetailData} />
      ) : null}
    </div>
  );
};

const TeacherCourse = (
  tabIdx,
  isLive,
  handleChangeTab,
  handleCloseLive,
  courseDetailData
) => {
  console.log(tabIdx);
  return (
    <div>
      <AppBar position="static" color="default" style={{ color: "red" }}>
        <Tabs
          value={tabIdx}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab style={{ fontWeight: "bold" }} label="Q&A" />
          <Tab style={{ fontWeight: "bold" }} label="Bài tập" />
          <Tab style={{ fontWeight: "bold" }} label="Chờ Duyệt" />
          <Tab style={{ fontWeight: "bold" }} label="Tham gia" />
        </Tabs>
      </AppBar>
      {tabIdx === 1 ? (
        <CourseTeaDeadline courseDetailData={courseDetailData} />
      ) : null}
      {tabIdx === 2 ? (
        <CourseTeaRequest courseDetailData={courseDetailData} />
      ) : null}
      {tabIdx === 3 ? (
        <CourseTeaManage courseDetailData={courseDetailData} />
      ) : null}
      {isLive === true ? (
        <CourseTeaStream
          courseDetailData={courseDetailData}
          isLive={isLive}
          handleCloseLive={handleCloseLive}
        />
      ) : null}
    </div>
  );
};

const StarRating = rate => {
  return (
    <div className="hw-star-rating-custom">
      {[1, 2, 3, 4, 5].map((_, index) => {
        return (
          <div key={index}>
            <i
              className={
                index <= rate - 1
                  ? "fas fa-star hw-star-rate"
                  : "fas fa-star hw-star-hide"
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default connect(
  null,
  actions
)(CourseEnroll);
