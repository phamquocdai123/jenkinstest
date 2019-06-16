import React, { Component } from 'react';
import './CourseLiveQues.css';
import Countdown from 'react-countdown-now';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Paper,
	Button,
	Typography,
	Fab,
	FormControl,
	TextField,
	FormControlLabel,
	FormGroup,
	Switch,
	Step,
	Stepper,
	StepLabel,
	Hidden,
	Chip,
	Avatar
} from '@material-ui/core';
import { Add, Note } from '@material-ui/icons';

import CourseLiveQuesResult from '../CourseLiveQuesResult';
import ModalQuestion from '../../../CommonComponent/Modal/ModalQuestion';

import SystemHelper from '../../../../../services/SystemHelper';
import { exam } from '../../../../../quesSample';

const style = {
	quesBox: {
		height: '95px',
		overflowY: 'scroll'
	}
};

class CourseLiveQues extends Component {
	constructor(props) {
		super(props);
		this.state = {
			examListIdx: 0,
			examStepIdx: 0,
			examSelect: {},
			examQuesList: [],
			examResultCurr: [],
			examQuesCurr: {},
			isStartExam: false,
			isStartSurvey: false,
			isStartQues: false,
			isFinishExam: false,
			isCreateQues: false,
			typeExamConfig: false,
			timeCurr: 0,
			timeConfig: 10
		};
		this.helper = new SystemHelper();
		this.examList = [];
		this.interval = null;
		this.examStepLabel = [
			'Câu 1',
			'Câu 2',
			'Câu 3',
			'Câu 4',
			'Câu 5',
			'Câu 6',
			'Câu 7',
			'Câu 8',
			'Câu 9',
			'Câu 10'
		];
	}

	componentWillMount() {
		this.examList = exam;
		this.initData();
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	initData = () => {
		if (this.examList.length > 0) {
			const index = this.state.examListIdx;
			this.setState(
				{
					examSelect: this.examList[index],
					examQuesList: this.examList[index].quesArr,
					examResultCurr: this.examList[index].result
				},
				() => {
					this.props.examNumQues(this.state.examQuesList.length);
				}
			);
		}
	};

	createExamList = (examList, isStartExam, examListIdx) => {
		return (
			<div>
				{examList.map((exam, index) => {
					return QuesItem(examListIdx, isStartExam, index, this.handleExamItemSelect);
				})}
			</div>
		);
	};

	createFirstQuestionManual = () => {
		const self = this;
		const index = 0;
		if (this.state.examSelect) {
			if (this.state.examQuesList.length > 0) {
				const examQuesCurr = this.state.examQuesList[index];
				self.setState({ examQuesCurr: examQuesCurr }, () => {
					self.createDataQues(index);
					self.setState({ isStartQues: true }, () => {
						setTimeout(() => {
							self.setState({ isStartQues: false });
						}, self.state.timeConfig * 1000);
					});
				});
			}
		}
	};

	createFirstQuestionAuto = () => {
		const index = 0;
		const timeInterval = this.state.timeConfig * 1000;
		if (this.state.examSelect) {
			if (this.state.examQuesList.length > 0) {
				const examQuesCurr = this.state.examQuesList[index];
				this.setState({ examQuesCurr: examQuesCurr }, () => {
					this.createDataQues(index);
					this.interval = setInterval(this.handleNextQuestion, timeInterval);
				});
			}
		}
	};

	createNextQuestion = () => {
		const index = this.state.examStepIdx;
		if (this.state.examSelect) {
			if (this.state.examQuesList.length > 0) {
				const examQuesCurr = this.state.examQuesList[index];
				this.setState({ examQuesCurr: examQuesCurr }, () => {
					this.createDataQues(index);
					this.setState({ isStartQues: true }, () => {
						setTimeout(() => {
							this.setState({ isStartQues: false });
						}, this.state.timeConfig * 1000);
					});
				});
			}
		}
	};

	createDataQues = (index) => {
		if (index || index === 0) {
			const quesData = {
				Question: this.state.examQuesCurr.question,
				Id: index + 1,
				Time: this.state.timeConfig,
				AnswerA: this.state.examQuesCurr.A,
				AnswerB: this.state.examQuesCurr.B,
				AnswerC: this.state.examQuesCurr.C,
				AnswerD: this.state.examQuesCurr.D,
				Result: this.state.examResultCurr[index]
			};
			this.props.sendDataQues(quesData);
		}
	};

	handleExamItemSelect = (event, index) => {
		const self = this;
		this.setState({ examListIdx: index }, () => {
			if (this.examList) {
				this.setState(
					{
						examSelect: this.examList[index],
						examQuesList: this.examList[index].quesArr,
						examResultCurr: this.examList[index].result
					},
					() => {
						self.props.examNumQues(self.state.examQuesList.length);
					}
				);
			}
		});
	};

	handleChangeTypeConfig = (e, typeExamConfig) => {
		this.setState({ typeExamConfig: typeExamConfig });
	};

	handleChangeTimeConfig = (e) => {
		if (e) {
			const timeConfig = e.target.value;
			if (timeConfig === '') {
				this.setState({ timeConfig: 10 });
			} else {
				this.setState({ timeConfig: Number(timeConfig) });
			}
		}
	};

	handleClickStartSurvey = () => {
		this.props.sendDataSurvey();
		this.setState({
			isStartSurvey: true,
			timeCurr: Date.now()
		});
	};

	handleClickStartQuestion = () => {
		if (!this.helper.isObjectEmty(this.state.examSelect)) {
			if (this.state.typeExamConfig) {
				this.setState({
					isStartExam: true,
					isFinishExam: false,
					timeCurr: Date.now()
				});
				this.createFirstQuestionAuto();
			} else {
				this.setState({
					isStartExam: true,
					isFinishExam: false,
					timeCurr: Date.now()
				});
				this.createFirstQuestionManual();
			}
		} else {
			return;
		}
	};

	handleNextQuestion = () => {
		if (this.state.examQuesList.length > 0) {
			if (this.state.examStepIdx < this.state.examQuesList.length - 1) {
				this.setState(
					(state) => ({
						examStepIdx: state.examStepIdx + 1,
						timeCurr: Date.now()
					}),
					() => {
						this.createNextQuestion();
					}
				);
			} else {
				if (this.interval) {
					clearInterval(this.interval);
				}
				this.setState(
					{
						isStartExam: false,
						isFinishExam: true,
						examStepIdx: 0,
						examQuesCurr: {}
					},
					() => {
						this.props.sendFinishExam();
					}
				);
			}
		}
		return;
	};

	handleCreateQuestionSet = () => {
		this.setState({ isCreateQues: true });
	};

	handleCloseCreateQuesSet = () => {
		this.setState({ isCreateQues: false });
	};

	render() {
		const examList = this.examList;
		const examStepLabel = this.examStepLabel;
		const { recvDataResult, surveyResult } = this.props;
		const {
			examListIdx,
			examStepIdx,
			examQuesList,
			examQuesCurr,
			examResultCurr,
			isStartExam,
			isStartSurvey,
			isStartQues,
			isFinishExam,
			isCreateQues,
			typeExamConfig,
			timeCurr,
			timeConfig
		} = this.state;
		return (
			<div className="course-live-ques">
				<div className="course-live-ques-list">
					<Paper elevation={3}>
						<Typography component="h3" variant="h6" align="center">
							Danh sách câu hỏi
						</Typography>
						<List component="nav" style={style.quesBox}>
							{examList.length > 0 ? this.createExamList(examList, isStartExam, examListIdx) : null}
						</List>
						<Divider />
						<div className="ques-list-btn d-flex justify-content-center">
							<Button
								disabled={isStartExam}
								centerRipple
								size="small"
								color="primary"
								variant="contained"
								aria-label="AddQuestion"
								onClick={this.handleCreateQuestionSet}
							>
								<Add />
								<span style={{ fontWeight: 'bold' }}>Tạo câu hỏi</span>
							</Button>
						</div>
					</Paper>
				</div>
				<div className="course-live-ques-board">
					<div className="ques-board-config">
						<div className="ques-board-config-type">
							<FormControl component="fieldset">
								<Typography component="h3" variant="h6">
									Cài đặt
								</Typography>
								<FormGroup>
									<FormControlLabel
										control={
											<Switch
												disabled={isStartExam}
												color="primary"
												checked={typeExamConfig}
												onChange={(e, typeExamConfig) =>
													this.handleChangeTypeConfig(e, typeExamConfig)}
											/>
										}
										label={!typeExamConfig ? 'Manual' : 'Auto'}
									/>
								</FormGroup>
							</FormControl>
						</div>
						<div className="ques-board-config-countdow">
							<Hidden xsDown>
								<Button
									centerRipple
									size="medium"
									disabled={isStartExam}
									style={{ marginLeft: '0.5em', marginRight: '0.5em' }}
									color="secondary"
									variant="contained"
									aria-label="AddQuestion"
									onClick={this.handleClickStartQuestion}
								>
									<span style={{ fontWeight: 'bold'}}>Bắt đầu</span>
								</Button>
								<Button
									disabled={isStartExam}
									size="medium"
									style={{ marginLeft: '0.5em', marginRight: '0.5em' }}
									centerRipple
									color="primary"
									variant="contained"
									onClick={this.handleClickStartSurvey}
								>
									<span style={{ fontWeight: 'bold' }}>Đánh giá</span>
								</Button>
							</Hidden>
							<TextField
								disabled={typeExamConfig}
								onChange={this.handleChangeTimeConfig}
								style={{width: '80px'}}
								InputLabelProps={{
									shrink: true,
								  }}
								label="Thời gian"
								variant="outlined"
								id="custom-css-outlined-input"
							/>
						</div>
					</div>
					<Hidden smUp>
						<div className="ques-board-config-start justify-content-center d-flex">
							<Fab disabled={isStartExam} centerRipple color="secondary" variant="extended">
								<span style={{ fontWeight: 'bold' }} onClick={this.handleClickStartQuestion}>
									Bắt đầu
								</span>
							</Fab>
						</div>
					</Hidden>
					{isStartExam ? (
						<div className="ques-board-process">
							{QuesCountdown(timeCurr, timeConfig, isStartQues, isStartSurvey, typeExamConfig)}
							<Stepper alternativeLabel activeStep={examStepIdx} orientation="horizontal">
								{examQuesList.map((_, index) => (
									<Step key={examStepLabel[index]}>
										<StepLabel style={{ fontWeight: 'bold' }}>{examStepLabel[index]}</StepLabel>
									</Step>
								))}
							</Stepper>
							{QuesSelect(examQuesCurr, examResultCurr[examStepIdx])}
							<Button
								disabled={typeExamConfig || isStartQues}
								variant="contained"
								color="primary"
								onClick={this.handleNextQuestion}
							>
								{examStepIdx === examQuesList.length - 1 ? 'Kết thúc' : 'Tiếp theo'}
							</Button>
						</div>
					) : null}
					{isFinishExam ? <CourseLiveQuesResult recvDataResult={recvDataResult} /> : null}
					{isStartSurvey && (
						<div>
							{QuesCountdown(timeCurr, timeConfig, isStartQues, isStartSurvey, typeExamConfig)}
							<div className="d-flex flex-column justify-content-center h-100 mt-3">
								<Typography variant="h5">Mức độ hiểu 0%: <span className="survey-color">{surveyResult[0]}</span> </Typography>
								<Typography variant="h5">Mức độ hiểu 10% - 30%: <span className="survey-color">{surveyResult[1]}</span></Typography>
								<Typography variant="h5">Mức độ hiểu 40% - 60%: <span className="survey-color">{surveyResult[2]}</span></Typography>
								<Typography variant="h5">Mức độ hiểu 70% - 90%: <span className="survey-color">{surveyResult[3]}</span></Typography>
								<Typography variant="h5">Mức độ hiểu 100%: <span className="survey-color">{surveyResult[4]}</span></Typography>
							</div>
						</div>
					)}
				</div>
				<ModalQuestion isShow={isCreateQues} isClose={this.handleCloseCreateQuesSet} />
			</div>
		);
	}
}

const QuesSelect = (ques, quesResult) => {
	return (
		<div className="ques-board-process-content">
			<Typography align="center" component="h3" variant="h4">
				{ques.question}
			</Typography>
			<div className="live-ques-answer-col">
				<Chip label={ques.A} color={quesResult === 'A' ? 'primary' : 'default'} style={{ width: '300px' }} />
				<Chip label={ques.B} color={quesResult === 'B' ? 'primary' : 'default'} style={{ width: '300px' }} />
			</div>
			<div className="live-ques-answer-col">
				<Chip label={ques.C} color={quesResult === 'C' ? 'primary' : 'default'} style={{ width: '300px' }} />
				<Chip label={ques.D} color={quesResult === 'D' ? 'primary' : 'default'} style={{ width: '300px' }} />
			</div>
		</div>
	);
};

const QuesItem = (examListIdx, isStartExam, index, handleExamItemSelect) => {
	return (
		<ListItem
			disabled={isStartExam}
			key={index}
			button
			selected={examListIdx === index}
			onClick={(event) => handleExamItemSelect(event, index)}
		>
			<ListItemIcon>
				<Note />
			</ListItemIcon>
			<ListItemText primary={'Bộ câu hỏi ' + (index + 1)} />
		</ListItem>
	);
};

const QuesCountdown = (timeCurr, timeConfig, isStartQues, isStartSurvey, typeExamConfig) => {
	console.log(isStartSurvey);
	const _timeConfig = timeConfig * 1000;
	return (
		<Avatar style={{ backgroundColor: '#c31432', width: '30px', height: '30px', fontSize: '18px' }}>
			{isStartQues === false && typeExamConfig === false && isStartSurvey === false ? (
				<span>0</span>
			) : (
				<Countdown
					date={timeCurr + (isStartSurvey === true ? 10000 : _timeConfig)}
					renderer={(props) => <div style={{ color: 'white', fontWeight: 'bold' }}>{props.seconds}</div>}
				/>
			)}
		</Avatar>
	);
};

export default CourseLiveQues;
