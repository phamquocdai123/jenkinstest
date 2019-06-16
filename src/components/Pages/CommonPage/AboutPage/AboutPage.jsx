import React, { Component } from 'react';
import './AboutPage.css';
import { connect } from 'react-redux';
import { Typography, Avatar } from '@material-ui/core';

import * as actions from '../../../../actions';

import banner from '../../../../assets/images/pic/hw-home-ele.png';
import divider from '../../../../assets/images/pic/hw-divider.png';
import dev1 from '../../../../assets/images/pic/dev1.jpg';
import dev2 from '../../../../assets/images/pic/dev2.jpg';
import dev3 from '../../../../assets/images/pic/dev3.jpg';
import dev4 from '../../../../assets/images/pic/dev4.jpg';

class AboutPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currIndex: 0
		};
	}

	componentWillMount() {
		this.props.removeTitle();
	}

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

	render() {
		return (
			<div>
				<HomePageTop />
				<AboutContent />
			</div>
		);
	}
}

const HomePageTop = () => {
	return (
		<div className="hw-homepage-top">
			<div className="hw-homepage-top-more">
				<div className="hw-homepage-top-typo d-flex flex-column pt-4">
					<div className="d-flex justify-content-center mt-5">
						<Typography component="h2" variant="h2" gutterBottom>
							Hello{'\u00A0'}
						</Typography>
						<Typography color="secondary" component="h2" variant="h2" gutterBottom>
							{'\u00A0'}World
						</Typography>
					</div>
					<div className="hw-divider">
						<img src={divider} alt="" />
					</div>
					<div>
						<Typography component="h2" variant="h2" gutterBottom style={{ height: '30px' }}>
							“
						</Typography>
						<Typography align="center" component="h2" variant="h4" gutterBottom className="px-5">
							Ở Hello World,
						</Typography>
						<Typography align="center" component="h2" variant="h4" gutterBottom className="px-5">
							việc học chưa bao giờ dễ dàng đến thế
						</Typography>

						<Typography component="h2" variant="h2" gutterBottom className="text-right">
							{'\u00A0'}”
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
};

const AboutContent = () => {
	return (
		<div className="about-us">
			<div className="container">
				<div className="row mb-5">
					<div className="col-md-7">
						<div className="d-flex justify-content-center">
							<Typography component="h2" variant="h2" gutterBottom>
								Mục tiêu của{'\u00A0'}
							</Typography>
							<Typography color="secondary" component="h2" variant="h2" gutterBottom>
								chúng tôi
							</Typography>
						</div>
						<div className="hw-divider">
							<img src={divider} alt="" />
						</div>
						<div className="about-content">
							<Typography component="h5" variant="subtitle1" align="inherit">
								Mục tiêu của HelloWorld! là trở thành một ứng dụng áp dụng và tận dụng tối đa lợi công
								nghệ livestream vào lĩnh vực giáo dục được mọi người tin dùng
							</Typography>
							<Typography component="h5" variant="subtitle1" align="inherit">
								Nâng cao sự tiện dụng - một trong những vấn đề quan trọng nhất được đặt ra là nhằm đảm
								bảo người dùng có thể dễ dàng sử dụng và tham gia học bất kì mọi lúc mọi nơi một cách
								tiện lợi và nhanh chóng nhất.
							</Typography>
							<Typography component="h5" variant="subtitle1" align="inherit">
								Hệ thống sẽ được xây dựng và phát triển trên cả smartphone lẫn nền tảng web nhằm mang
								lại trải nghiệm tuyệt vời cho người dungfkhi sử dụng.
							</Typography>
							<Typography component="h5" variant="subtitle1" align="inherit">
								Hỗ trợ một cách tuyệt đối cho cả học viên và giáo viên: Ứng dụng luôn đặt người dùng là
								trọng tâm và nền tảng để phát triển vì thế chúng tôi luôn cố gắng mang lại những công cụ
								hỗ trợ tốt nhất đến cho người dùng.
							</Typography>
							<Typography component="h5" variant="subtitle1" align="inherit">
								Giao diện người dùng thân thiện dễ sử dụng.Thao tác đơn giản, "dễ xơi".
							</Typography>
						</div>
					</div>
					<div className="col-md-5">
						<img src={banner} alt="" />
					</div>
				</div>
				<div className="d-flex justify-content-center">
					<Typography component="h2" variant="h2" gutterBottom>
						Đội Ngũ {'\u00A0'}
					</Typography>
					<Typography color="secondary" component="h2" variant="h2" gutterBottom>
						Phát Triển
					</Typography>
				</div>
				<div className="hw-divider">
					<img src={divider} alt="" />
				</div>
				{DevCard()}
			</div>
		</div>
	);
};

const DevCard = () => {
	const devData = [
		{
			img: dev1,
			name: 'Vòng Tần Dũng',
			cmt: 'Back End Dev'
		},
		{
			img: dev2,
			name: 'Lê Võ Hoàng Duy',
			cmt: 'Web Dev'
		},
		{
			img: dev3,
			name: 'Phạm Quốc Đại',
			cmt: 'Mobile Dev'
		},
		{
			img: dev4,
			name: 'Nguyễn Hữu Minh Đạt',
			cmt: 'Designer'
		}
	];
	return (
		<div className="row dev-card">
			{devData.map((_data, index) => {
				return (
					<div className="col-md-3 my-3">
						<div id="card">
							<div id="front">
								<div id="top-pic" />
								<div id="avatar">
									<Avatar
										alt="Dev"
										src={_data.img}
										style={{
											width: '100%',
											height: '100%'
										}}
									/>
								</div>
								<div id="info-box">
									<div className="info">
										<h1>{_data.name}</h1>
										<h2>{_data.cmt}</h2>
									</div>
								</div>
								<div id="social-bar">
									<a href="#">
										<i className="fab fa-facebook-f" />
									</a>
									<a href="#">
										<i className="fab fa-instagram" />
									</a>
									<a href="#">
										<i className="fab fa-google-plus-g" />
									</a>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default connect(null, actions)(AboutPage);
