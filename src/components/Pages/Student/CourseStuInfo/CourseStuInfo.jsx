import React, { Component } from 'react';
import './CourseStuInfo.css';
import { Paper, Toolbar, Typography } from '@material-ui/core';

class CourseStuInfo extends Component {
	render() {
		return (
			<div className="course-student-info">
				<Paper elevation={4}>
					<Toolbar>
						<div className="student-info-title">
							<Typography variant="h6">Thông tin khoá học</Typography>
						</div>
					</Toolbar>
					<div className="student-info-content"></div>
				</Paper>
			</div>
		);
	}
}

export default CourseStuInfo;
