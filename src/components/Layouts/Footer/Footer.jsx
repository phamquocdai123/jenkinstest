import React, { Component } from 'react';
import './Footer.css';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import logo from '../../../assets/images/pic/logo.png';



import * as actions from '../../../actions';

class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="footer">
				{FooterTop()}
				{FooterBot()}
			</div>
		);
	}
}

const FooterTop = () =>{
	return(
		<div className="footer-top">
			<div className = "container">
				<div className = "row">
					<div className="col-md-3 mb-3">
						<img src={logo} alt="logo" className = "footer-logo"/>
						<Typography component="h5" variant="subtitle1" align="left" gutterBottom>
						HelloWord - Ứng dụng học online với đầy đủ tiện nghi với hi vọng mang đến những trải nghiệm tuyệt vời nhất trong việc học
						</Typography>
					</div>	

					<div className="col-md-4 offset-md-1">
						<h3 className="mb-4">Liên hệ</h3>	
						<Typography component="h5" variant="subtitle1" gutterBottom>
						<i className="fas fa-map-marker-alt"></i>
						227 Đường Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh
						</Typography>
						<Typography component="h5" variant="subtitle1" gutterBottom>
						<i className="fas fa-phone"></i> Phone: 0389 747 373
						</Typography>
						<Typography component="h5" variant="subtitle1" gutterBottom>
						<i className="fas fa-envelope"></i> Email: <a href="mailto:helloworldlivestreamapp@gmail.com">helloworldlivestreamapp@gmail.com</a>
						</Typography>
					</div>

					<div className="col-md-4">
						<div className= "location-map">
							<iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.630704761159!2d106.679983014287!3d10.762918262387192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c06f4e1dd%3A0x43900f1d4539a3d!2sHo+Chi+Minh+City+University+of+Science!5e0!3m2!1sen!2s!4v1557502566027!5m2!1sen!2s" width="420" height="200" frameBorder="0" allowFullScreen></iframe>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
};

const FooterBot = () =>{
	return (
		<div className="footer-bot">
			<div className="container">
	        		<div className="row">
	           			<div className="col-md-6 footer-link align-self-center">
	                    	© 2019 E-learning product by <a href="#">Hello World</a>
	                    </div>
	           			<div className="col-md-6 footer-social">
	                    	<a href="#"><i className="fab fa-facebook-f"></i></a> 
							<a href="#"><i className="fab fa-twitter"></i></a> 
							<a href="#"><i className="fab fa-google-plus-g"></i></a> 
							<a href="#"><i className="fab fa-instagram"></i></a> 
							<a href="#"><i className="fab fa-pinterest"></i></a>
	                    </div>
	           		</div>
	        	</div>
		</div>
	)
};


export default withRouter(connect(null, actions)(Footer));
