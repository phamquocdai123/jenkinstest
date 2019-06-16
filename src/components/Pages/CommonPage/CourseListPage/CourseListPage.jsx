import React, { Component } from 'react';
import './CourseListPage.css';
import { connect } from 'react-redux';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { TextField, Button, FormControl, MenuItem, InputAdornment, IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import Pagination from 'material-ui-flat-pagination';
import WebService from '../../../../services/WebService';

import CourseListItem from '../../CommonComponent/Course/CourseListItem';
import Loading from '../../CommonComponent/Other/Loading';
import * as actions from '../../../../actions';
import { INPUT_MU } from '../../../../setting/ThemeUiConfig';

class CourseListPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isWaiting: false,
			numSel: 9,
			cateSel: 1,
			courseList: []
		};
		this.webService = new WebService();
		this.cateLabel = [
			'Công Nghệ Thông Tin',
			'Kỹ Năng Mềm',
			'Thiết Kế',
			'Ngoại Ngữ',
			'Toán',
			'Khoa Học Tự Nhiên',
			'Khoa Học Xã Hội',
			'Âm Nhạc',
			'Sức Khoẻ',
			'Kinh Tế'
		];
	}

	componentDidMount() {
		this.props.setTitle('Danh Sách Khóa Học');
		this.callApiGetAllCourse();
	}

	callApiGetAllCourse = async () => {
		this.setState({ isWaiting: true });
		const resApi = await this.webService.getAllCourse();
		this.handleGetAllCourseApi(resApi);
		this.setState({ isWaiting: false });
	};

	handleGetAllCourseApi = (resApi) => {
		if (resApi.returnCode === 0) {
			this.props.showNotice(resApi.returnMess, 0);
		} else {
			const result = resApi.data;
			this.setState({ courseList: result });
		}
	};

	handleCategoryChange = (e) => {
		this.setState({ cateSel: Number(e.target.value) });
	};

	handleNumChange = (e) => {
		this.setState({ numSel: Number(e.target.value) });
	};

	render() {
		const { isWaiting, courseList, cateSel, numSel } = this.state;
		const category = this.cateLabel;
		return (
			<div className="hw-course-list">
				<MuiThemeProvider theme={INPUT_MU}>
					<div className="container">
						<div className="row">
							<div className="col-12 col-sm-12 col-lg-12 col-xl-9 col-rep-1">
								<div className="hw-course-filter">
									<div className="hw-course-view">
										<TextField
											select
											variant="outlined"
											label="Hiển thị"
											className="hw-course-filter-flex"
											value={numSel}
											onChange={this.handleNumChange}
										>
											{[ 9, 12, 15 ].map((data, index) => {
												return (
													<MenuItem key={data} value={data}>
														{data} khoá học
													</MenuItem>
												);
											})}
										</TextField>
									</div>
									<div className="hw-course-sort">
										<TextField
											select
											variant="outlined"
											label="Sắp xếp"
											className="hw-course-filter-flex"
										/>
										<Button className="btn-filter-first" color="primary" variant="outlined">
											<i className="fas fa-th fa-2x" />
										</Button>
										<Button className="btn-filter-last" color="primary" variant="outlined">
											<i className="fas fa-list fa-2x" />
										</Button>
									</div>
								</div>
								{isWaiting === true && <Loading />}
								{courseList !== [] && (
									<div className="hw-course-list-arr">
										<div className="hw-course-list-item row">
											{courseList.map((data, index) => {
												return <CourseListItem key={index} courseData={data} />;
											})}
										</div>
										<div className="hw-course-list-pagination d-flex justify-content-center align-item-center">
											<Pagination
												limit={10}
												offset={1}
												total={100}
												nextPageLabel={<i className="fas fa-chevron-circle-right fa-2x" />}
												previousPageLabel={<i className="fas fa-chevron-circle-left fa-2x" />}
												centerRipple={true}
											/>
										</div>
									</div>
								)}
							</div>
							<div className="col-12 col-sm-12 col-lg-12 col-xl-3 col-rep-2">
								<div className="hw-course-find">
									<div className="hw-course-find-title">
										<span className="hw-find-title-fist">TÌM&nbsp;</span>
										<span className="hw-find-title-second">KHOÁ HỌC</span>
									</div>
									<div className="hw-course-find-form">
										<FormControl fullWidth={true}>
											<div>
												<h5>Loại khoá học</h5>
												<TextField
													margin="normal"
													variant="outlined"
													fullWidth
													select
													value={cateSel}
													onChange={this.handleCategoryChange}
												>
													{category.map((data, index) => {
														return (
															<MenuItem key={index + 1} value={index + 1}>
																{data}
															</MenuItem>
														);
													})}
												</TextField>
											</div>
											<div>
												<h5>Tìm kiếm</h5>
												<TextField
													margin="normal"
													variant="outlined"
													fullWidth
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<IconButton>
																	<Search />
																</IconButton>
															</InputAdornment>
														)
													}}
												/>
											</div>
										</FormControl>
									</div>
								</div>
							</div>
						</div>
					</div>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default connect(null, actions)(CourseListPage);
