import React, { Component } from 'react';
import './CourseStreamQues.css';
import Countdown from 'react-countdown-now';
import { Typography, Chip } from '@material-ui/core';
import {Done, AccessTime} from '@material-ui/icons';

class CourseStreamQues extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFinished: false,
			isCountDown: true,
			currIdx: 0,
			currTime: Date.now(),
			currQues: null,
			currAns: '',
			corrAns: ''
		};
		this.currIdx = 0;
		this.interval = null;
	}

	componentWillMount() {
		// this.createIntervalQuestion();
	}

	componentDidUpdate(prevProps) {
		if (this.props.streamQues !== prevProps.streamQues) {
			this.setState({ currAns: '', currTime: Date.now(), isCountDown: true });
		}
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
		if (this.state.currTime) {
			this.setState({ currTime: null });
		}
	}

	handleChooseAns = (event, value) => {
		if (this.state.currAns !== '' || this.state.corrAns !== '' || this.state.isCountDown === false) {
			return;
		} else {
			// this.props.checkStreamResult(null);
			this.setState({ currAns: value });
			this.setState({
				currAnsStyle: {
					...this.state.currAnsStyle,
					color: 'primary',
					variant: 'default'
				}
			});
		}
	};

	handleCountDownCom = () => {
		this.setState({ isCountDown: false});
		if (this.props.isSurvey === false){
			this.props.checkStreamResult(this.state.currAns);
		} else {
			this.props.checkStreamSurvey(this.state.currAns);
		}
	};

	checkColorAns = (value, corrAns) => {
		if (corrAns === null && this.state.currAns === '') {
			return 'default';
		} else {
			if (this.state.currAns === corrAns && corrAns === value) {
				return 'secondary';
			} else if (this.state.currAns === value && corrAns !== value) {
				return 'primary';
			} else if (this.state.currAns !== value && corrAns === value) {
				return 'secondary';
			} else if (this.state.currAns !== value && corrAns !== value) {
				return 'default';
			}
		}
	};

	checkVariantAns = (value, corrAns) => {
		if (corrAns === null && this.state.currAns === '') {
			return 'outlined';
		} else {
			if (this.state.currAns === corrAns && corrAns === value) {
				return 'default';
			} else if (this.state.currAns === value && corrAns !== value) {
				return 'default';
			} else if (this.state.currAns !== value && corrAns !== value) {
				return 'outlined';
			}
		}
	};

	checkIconAns = (value, corrAns) => {
		if (corrAns === '') {
			return null;
		} else {
			if (corrAns === value) {
				return <Done />;
			} else {
				return null;
			}
		}
	};

	render() {
		const { Question, AnswerA, AnswerB, AnswerC, AnswerD, Id, Time } = this.props.streamQues;
		const { currTime, isCountDown } = this.state;
		const result = this.props.streamResult;
		return (
			<div className="course-stream-ques">
				<div className="stream-ques-countdown">
					<Chip
						variant="default"
						icon={<AccessTime />}
						color="secondary"
						label={quesCountdown(currTime, Time, Id, isCountDown, this.handleCountDownCom)}
					/>
				</div>
				<div className="stream-ques-title d-flex justify-content-center flex-column">
					<Typography align="center" component="h2" variant="h4" gutterBottom>
						{Question}
					</Typography>
				</div>
				<div className="stream-ques-answer">
					<div className="stream-ques-answer-col">
						<Chip
							style={{ width: '300px' }}
							label={AnswerA}
							color={this.checkColorAns('A', result)}
							variant={this.checkVariantAns('A', result)}
							icon={this.checkIconAns('A', result)}
							onClick={(e, A = 'A') => this.handleChooseAns(e, A)}
						/>
						<Chip
							style={{ width: '300px' }}
							label={AnswerB}
							color={this.checkColorAns('B', result)}
							variant={this.checkVariantAns('B', result)}
							icon={this.checkIconAns('B', result)}
							onClick={(e, B = 'B') => this.handleChooseAns(e, B)}
						/>
					</div>
					<div className="stream-ques-answer-col">
						<Chip
							style={{ width: '300px' }}
							label={AnswerC}
							color={this.checkColorAns('C', result)}
							variant={this.checkVariantAns('C', result)}
							icon={this.checkIconAns('C', result)}
							onClick={(e, C = 'C') => this.handleChooseAns(e, C)}
						/>
						<Chip
							style={{ width: '300px' }}
							label={AnswerD}
							color={this.checkColorAns('D', result)}
							variant={this.checkVariantAns('D', result)}
							icon={this.checkIconAns('D', result)}
							onClick={(e, D = 'D') => this.handleChooseAns(e, D)}
						/>
					</div>
				</div>
			</div>
		);
	}
}

const quesCountdown = (currTime, timeOut, indexQuestion, isCountDown, handleCountDownCom) => {
	const _timeOut = timeOut * 1000;

	return (
		<div className="d-flex align-items-center">
			<div style={{ width: '20px' }}>
				{isCountDown === true ? (
					<Countdown
						date={currTime + _timeOut}
						// autoStart={true}
						onComplete={handleCountDownCom}
						renderer={(props) => <div style={{ color: 'white', fontWeight: 'bold' }}>{props.seconds}</div>}
					/>
				) : (
					<span>0</span>
				)}
			</div>
			<div style={{ fontWeight: 'bold' }}>{indexQuestion ? `Câu ${indexQuestion}` : 'Khảo sát'}</div>
		</div>
	);
};

export default CourseStreamQues;
