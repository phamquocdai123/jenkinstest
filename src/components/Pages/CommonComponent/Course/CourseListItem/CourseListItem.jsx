import React, { Component } from 'react';
import './CourseListItem.css';
import { withRouter } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Avatar, Tooltip } from '@material-ui/core';

import sample from '../../../../../assets/images/pic/hw-homepage-sample.jpg';
import sampleCourse from '../../../../../assets/images/pic/hw-course-sample.jpg';

class CourseListItem extends Component {
	constructor(props) {
		super(props);
	}

	handleCourseItemClick = (e, courseId) => {
		this.props.history.push(`/khoa-hoc/${courseId}`);
	};

	render() {
		const courseData = this.props.courseData;
		return (
			<div
				className={this.props.component !== 'home' ? 'col-md-4 hw-course-item' : 'hw-course-item'}
				onClick={(e, courseId = courseData.CourseId) => this.handleCourseItemClick(e, courseId)}
				key={courseData.Code}
			>
				<Card className="hw-course-box">
					<CardActionArea>
						<CardMedia image={sampleCourse} style={{ minHeight: '130px', maxHeight: '130px' }} />
					</CardActionArea>
					<CardContent>
						<Tooltip title={courseData.Title} placement="top">
							<div className="hw-course-title">
								<Typography align="justify" gutterBottom variant="h5" component="h2">
									{courseData.Title}
								</Typography>
							</div>
						</Tooltip>
						<div className="hw-course-author-info">
							<Avatar alt="" src={sample} />
							<Typography gutterBottom component="p" className="hw-course-teach-name">
								{courseData.Name}
							</Typography>
						</div>
						<div className="hw-course-more-info">
							<div className="hw-course-price-info">
								<div className="price hw-gradient-color">{courseData.Price} &#8363;</div>
							</div>
							<div className="hw-course-rate-info">{StarRating(courseData.Rating)}</div>
						</div>
						<div className="hw-course-state-info">
							<span>Live</span>
							<i className="far fa-dot-circle" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}
}

const StarRating = (rate) => {
	return (
		<div className="hw-star-rating">
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

export default withRouter(CourseListItem);
