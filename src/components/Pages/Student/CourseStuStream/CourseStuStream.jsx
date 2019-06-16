import React, { Component } from 'react';
import './CourseStuStream.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Paper, AppBar, Tabs, Tab, Typography, Fab } from '@material-ui/core';
import { QuestionAnswer, Message, Mic, PanTool } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';

import * as actions from '../../../../actions';
import { PEER_CONFIG, STREAM_CONFIG_OP1 } from '../../../../setting/ConstantConfig';

import CourseStreamChat from './CourseStreamChat';
import CourseStreamQues from './CourseStreamQues';
import WebService from '../../../../services/WebService';
import SystemHelper from '../../../../services/SystemHelper';

class CourseStuStream extends Component {
	constructor(props) {
		super(props);
		this.state = {
			remoteStream: 'stream',
			localStream: null,
			screenTrack: null,
			liveTrack: null,
			isPlayStream: false,
			isFinishExam: false,
			heightBox: 0,
			tabStreamIdx: 0,
			peerId: '',
			messArr: [],
			quesStream: {},
			answerStream: '',
			resultStream: '',
			rightAnsStream: 0,
			infoExam: {},
			isSurvey: false
		};
		this.helper = new SystemHelper();
		this.webService = new WebService();
		this.getUserMedia = null;
		this.clientIO = null;
		this.peerConection = null;
		this.messArr = [];
		this.streamElement = null;
		this.originStream = null;
	}

	componentDidMount() {
		this.createChatBox();
		// this.getMedia(STREAM_CONFIG_OP1);
		this.createSocket();
		this.processSocket();
		this.joinRoomSocket();
	}

	componentWillUnmount() {
		this.destroySocket();
		if (this.peerConection) {
			this.peerConection.close();
			this.peerConection = null;
		}
	}

	createSocket = () => {
		this.clientIO = io(PEER_CONFIG.URL, {
			query: {
				userName: this.webService.getUserName()
			}
		});
	};

	createChatBox = () => {
		const heightBox = this.streamElement.clientHeight;
		this.setState({ heightBox }, () => {
			this.props.createChat();
		});
	};

	processSocket = () => {
		if (this.clientIO !== null) {
			this.clientIO.on('id', this.handleIdSocket);
			this.clientIO.on('forcerejoin', this.handleForceRejoin);
			this.clientIO.on('offer', this.handleOfferRes);
			this.clientIO.on('answer', this.handleAnswerHost);
			this.clientIO.on('serverbroadcastcomment', this.handleMessChat);
			this.clientIO.on('serversendsurvey', this.handleSurveyFromServer);
			this.clientIO.on('serversendquestion', this.handleQuesFromServer);
			this.clientIO.on('serversendresult', this.handleAnsFromServer);
			this.clientIO.on('finishedquizz', this.handleExamFinish);
			this.clientIO.on('switchstream', this.handleSwitchStream);
		}
	};

	destroySocket = () => {
		if (this.clientIO) {
			this.clientIO.close();
		}
	};

	handleIdSocket = (_peerId) => {
		this.setState({ peerId: _peerId });
	};

	handleForceRejoin = () => {
		sessionStorage.setItem('currIdx', 1);
		window.location.reload();
	};

	handleOfferRes = (offerRes) => {
		let pc = this.peerConection || this.createPeerHost();
		pc.setRemoteDescription(new RTCSessionDescription(offerRes), function() {}, () => {});
		this.createAnswerToHost();
	};

	handleAnswerHost = (data) => {
		if (data) {
			let pc = this.peerConection;
			console.log(this.peerConection);
			pc.setRemoteDescription(new RTCSessionDescription(data.answer), () => {}, () => {});
		}
	};

	handleMessChat = (data) => {
		this.messArr.push(data);
		this.props.updateChat(this.messArr);
	};

	handleSurveyFromServer = (data) => {
		this.setState({ resultStream: '', quesStream: data, isSurvey: true });
	};

	handleQuesFromServer = (quesStream) => {
		if (this.state.resultStream !== '') {
			this.setState({ resultStream: '' });
		}
		this.setState({ quesStream: quesStream });
	};

	handleAnsFromServer = (resultStream) => {
		const self = this;
		self.setState({ resultStream: resultStream }, () => {
			if (self.state.answerStream === resultStream) {
				self.setState({
					rightAnsStream: self.state.rightAnsStream + 1,
					answerStream: ''
				});
			}
		});
	};

	handleCheckStreamSurvey = (currAns) => {
		this.setState({ isSurvey: false, quesStream: {} }, () => {
			this.clientIO.emit('sendbacksurvey', currAns);
		});
	};

	handleCheckStreamResult = (currAns) => {
		if (currAns) {
			this.setState({ answerStream: currAns });
		}
		const data = {
			peerId: this.state.peerId
		};
		this.clientIO.emit('checkresult', data);
	};

	handleExamFinish = () => {
		this.setState({ isFinishExam: true, quesStream: {} }, () => {
			const infoExam = {
				name: this.webService.getUserName(),
				score: this.state.rightAnsStream
			};
			this.setState({ infoExam });
			this.clientIO.emit('finalresult', infoExam);
		});
	};

	createAnswerToHost = () => {
		const self = this;
		const roomId = this.props.courseDetailData.Code;
		let pc = this.peerConection;
		pc.createAnswer(
			function(sessionDescription) {
				pc.setLocalDescription(sessionDescription);
				let data = {
					roomName: roomId,
					socketId: self.state.peerId,
					answer: sessionDescription
				};
				self.clientIO.emit('answer', data);
			},
			() => {}
		);
	};

	createPeerHost = () => {
		const self = this;
		let peer = new RTCPeerConnection(PEER_CONFIG.CONNECTION, PEER_CONFIG.CONSTRAINTS, PEER_CONFIG.SDP);
		peer.onicecandidate = (e) => {
			console.log(e);
			if (e.candidate) {
				let data = {
					socketId: self.state.peerId,
					payload: {
						label: e.candidate.sdpMLineIndex,
						id: e.candidate.sdpMid,
						candidate: e.candidate.candidate
					}
				};
				self.clientIO.emit('candidate', data);
			}
		};
		peer.onaddstream = async (event) => {
			console.log('stream');
			const video = document.querySelector('video');
			const lengthTrack = event.stream.getTracks().length;
			if (event.stream) {
				if (lengthTrack === 3) {
					const stream = event.stream;
					const liveTrack = await stream.getVideoTracks()[0];
					const screenTrack = await stream.getVideoTracks()[1];
					self.setState(
						{ remoteStream: event.stream, liveTrack: liveTrack, screenTrack: screenTrack },
						() => {
							video.srcObject = this.state.remoteStream;
							self.originStream = this.state.remoteStream;
						}
					);
				} else {
					video.srcObject = event.stream;
					self.setState({ remoteStream: event.stream });
				}
			}
		};
		peer.onremovestream = function(event) {
			console.log('disconnect stream');
			// self.setState({ remoteStream: null });
		};
		peer.ontrack = (event) => {
			console.log(event);
		};
		peer.oniceconnectionstatechange = (event) => {
			switch ((event.srcElement || event.target).iceConnectionState) { // Chrome // Firefox
				case 'disconnected':
					console.log('disconnect stream1');
					self.setState({ remoteStream: 'stream' });
					break;
				case 'failed':
					console.log('disconnect stream2');
					self.setState({ remoteStream: 'stream' });
					break;
				case 'closed':
					console.log('disconnect stream3');
					self.setState({ remoteStream: 'stream' });
					break;
				default:
					break;
			}
		};
		peer.onicecandidateerror = (event) => {
			console.log('ice err');
			self.setState({ remoteStream: null });
		};
		peer.onnegotiationneeded = (event) => {
			console.log(event);
		};
		this.peerConection = peer;
		return peer;
	};

	createSendMessChat = (dataMess) => {
		if (dataMess) {
			this.clientIO.emit('usercomment', dataMess);
		}
	};

	joinRoomSocket = () => {
		if (this.clientIO) {
			const roomId = this.props.courseDetailData.Code;
			this.clientIO.emit('joinroom', roomId);
		}
	};

	getMedia = (mediaConfig) => {
		if (navigator.getUserMedia) {
			this.getUserMedia = navigator.getUserMedia(mediaConfig, this.handleStreamSuc, this.handleStreamErr);
		} else if (navigator.webkitGetUserMedia) {
			this.getUserMedia = navigator.webkitGetUserMedia(mediaConfig, this.handleStreamSuc, this.handleStreamErr);
		} else if (navigator.mozGetUserMedia) {
			this.getUserMedia = navigator.mozGetUserMedia(mediaConfig, this.handleStreamSuc, this.handleStreamErr);
		}
	};

	handleStreamSuc = (stream) => {
		if (stream) {
			this.setState({ localStream: stream }, () => {
				this.createSocket();
				this.processSocket();
				this.joinRoomSocket();
			});
		}
	};

	handleStreamReady = () => {
		const heightBox = this.streamElement.clientHeight;
		this.setState({ heightBox }, () => {
			setTimeout(() => {
				this.setState({ isPlayStream: true });
			}, 500);
		});
	};

	handleChangeTab = (event, index) => {
		this.setState({ tabStreamIdx: index });
	};

	handleCallHost = () => {
		const self = this;
		const pc = this.peerConection;
		this.addStreamToHost(pc);
		pc.createOffer((sessionDescription) => {
			self.handleCreateOfferSuc(sessionDescription, pc);
		}, self.handleCreateOfferErr);
	};

	handleHandUp = () => {
		this.clientIO.emit('StudentHandUp', this.state.peerId);
	};

	handleCreateOfferSuc = (sessionDescription, pc) => {
		const data = {
			peerId: this.state.peerId,
			type: '0',
			offer: sessionDescription
		};
		pc.setLocalDescription(sessionDescription);
		this.clientIO.emit('sendlivestreamoffer', data);
	};

	handleCreateOfferErr = (e) => {
		//Do nothing
		console.log(e);
	};

	addStreamToHost = (pc) => {
		if (this.state.localStream) {
			!!pc.getLocalStreams().length
				? pc.removeStream(this.state.localStream)
				: pc.addStream(this.state.localStream);
		}
	};

	handleSwitchStream = (typeStream) => {
		const mediaStream = this.originStream;
		const video = document.querySelector('video');
		const { liveTrack, screenTrack } = this.state;
		if (typeStream) {
			if (typeStream === '1') {
				console.log(mediaStream.getTracks());
				mediaStream.removeTrack(liveTrack);
				mediaStream.removeTrack(screenTrack);
				mediaStream.addTrack(screenTrack);
				this.setState({ remoteStream: mediaStream }, () => {
					video.srcObject = mediaStream;
				});
			} else if (typeStream === '0') {
				mediaStream.removeTrack(liveTrack);
				mediaStream.removeTrack(screenTrack);
				mediaStream.addTrack(liveTrack);
				this.setState({ remoteStream: mediaStream }, () => {
					video.srcObject = mediaStream;
				});
			}
		}
	};

	render() {
		const {
			heightBox,
			tabStreamIdx,
			remoteStream,
			isPlayStream,
			isFinishExam,
			quesStream,
			resultStream,
			infoExam,
			isSurvey
		} = this.state;
		const isShowQues = this.helper.isObjectEmty(quesStream);
		return (
			<div className="course-student-stream">
				<Paper elevation={4}>
					<div className="d-flex stream-box justify-content-center">
						<div
							ref={(streamElement) => (this.streamElement = streamElement)}
							className="course-stream-video"
						>
							<ReactPlayer
								preload={'false'}
								url={remoteStream}
								playing={isPlayStream}
								onReady={this.handleStreamReady}
								controls
							/>
							<Fab
								size="medium"
								style={{
									backgroundColor: 'white',
									position: 'absolute',
									top: '0',
									right: '0',
									margin: '1em'
								}}
								aria-label="Mic"
								onClick={this.handleCallHost}
							>
								<Mic color="primary" />
							</Fab>
							<Fab
								size="medium"
								style={{
									backgroundColor: 'white',
									position: 'absolute',
									top: '0',
									right: '4em',
									margin: '1em'
								}}
								aria-label="handUp"
								onClick={this.handleHandUp}
							>
								<PanTool color="secondary" />
							</Fab>
						</div>
						<div className="course-stream-action">
							<AppBar
								position="static"
								color="primary"
								style={{ marginLeft: '0.5em', marginRight: '0.5em' }}
							>
								<Tabs
									value={tabStreamIdx}
									onChange={this.handleChangeTab}
									variant="fullWidth"
									indicatorColor="primary"
									textColor="inherit"
									centered={true}
								>
									<Tab style={{ fontWeight: 'bold' }} label="Chat" icon={<Message />} />
									<Tab style={{ fontWeight: 'bold' }} label="Câu hỏi" icon={<QuestionAnswer />} />
									{/* <Tab style={{ fontWeight: 'bold' }} label="..." icon={<More />} /> */}
								</Tabs>
							</AppBar>
							<SwipeableViews
								index={tabStreamIdx}
								style={{
									width: '100%',
									height: '100%',
									marginLeft: '0.5em',
									marginRight: '0.5em'
								}}
								slideStyle={{ height: '100%' }}
								containerStyle={{ height: '100%' }}
							>
								<CourseStreamChat sendDataMess={this.createSendMessChat} heightBox={heightBox} />
								{isShowQues !== true ? (
									<CourseStreamQues
										streamQues={quesStream}
										streamResult={resultStream}
										checkStreamResult={this.handleCheckStreamResult}
										checkStreamSurvey={this.handleCheckStreamSurvey}
										isSurvey={isSurvey}
									/>
								) : (
									<div className="d-flex justify-content-center mt-2 align-item-center h-100">
										{isFinishExam === false ? (
											<Typography component="h4" variant="h5">
												Chưa có câu hỏi nào
											</Typography>
										) : (
											<Typography component="h4" variant="h5">
												Kết quả của &nbsp; <b>{this.webService.getUserName()}</b>:{' '}
												<span style={{ color: 'red' }}>{infoExam.score}</span> câu đúng
											</Typography>
										)}
									</div>
								)}
							</SwipeableViews>
						</div>
					</div>
				</Paper>
			</div>
		);
	}
}

export default connect(null, actions)(withRouter(CourseStuStream));
