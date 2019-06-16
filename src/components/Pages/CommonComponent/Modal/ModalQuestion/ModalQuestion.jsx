import React, { Component } from 'react';
import './ModalQuestion.css';
import { connect } from 'react-redux';
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Radio
} from '@material-ui/core';
import { Close, RadioButtonUnchecked, RadioButtonChecked } from '@material-ui/icons';

import Loading from '../../Other/Loading';

import * as actions from '../../../../../actions';
import SystemHelper from '../../../../../services/SystemHelper';
import WebService from '../../../../../services/WebService';

class ModalQuestion extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isWaiting: false,
			questionIndex: 0,
			question: '',
			ansA: '',
			ansB: '',
			ansC: '',
			ansD: '',
			ansRight: null,
			ansRightArr: [],
			questionSet: []
		};
		this.helper = new SystemHelper();
		this.webService = new WebService();
	}

	handleNextQuestion = () => {
		let { question, ansA, ansB, ansC, ansD, ansRight } = this.state;
		const validate = this.helper.checkValidateQuestion(question, ansA, ansB, ansC, ansD, ansRight);
		if (validate !== '') {
			this.props.showNotice(validate, 0);
			return;
		} else {
			this.handleCreateQuestion();
		}
	};

	handleCreateQuestion = (type) => {
		let { question, ansA, ansB, ansC, ansD, ansRight } = this.state;
		let ansRightArr = [ ...this.state.ansRightArr ];
		let questionSet = [ ...this.state.questionSet ];
		let questionData = {
			question: question,
			A: ansA,
			B: ansB,
			C: ansC,
			D: ansD
		};
		questionSet.push(questionData);
		switch (ansRight) {
			case 0:
				ansRightArr.push('A');
				break;
			case 1:
				ansRightArr.push('B');
				break;
			case 2:
				ansRightArr.push('C');
				break;
			case 3:
				ansRightArr.push('D');
				break;
			default:
				break;
		}
		this.setState(
			{
				questionSet,
				ansRightArr
			},
			() => {
				if (type === 0) {
					this.handleResetForm(0);
				} else {
					this.callApiAddQuestionSet();
				}
			}
		);
	};

	handleSumbitQuestion = () => {
			this.handleCreateQuestion(1);
	}

	callApiAddQuestionSet = async () => {
		this.setState({ isWaiting: true });
		const resApi = await this.webService.addQuestionSet(this.state.questionSet, this.state.ansRightArr);
		this.handleAddQuestionSetApi(resApi);
		this.setState({ isWaiting: false });
	}

	handleAddQuestionSetApi = (resApi) => {
		console.log(resApi)
	}

	handleCloseCreateQuestion = () => {
		this.props.isClose();
		// this.props.handleCloseSubmitPopup();
		// this.handleResetForm();
	};

	handleResetForm = (type) => {
		console.log(type)
		if (type === 0) {
			this.setState({
				isWaiting: false,
				questionIndex: this.state.questionIndex + 1,
				question: '',
				ansA: '',
				ansB: '',
				ansC: '',
				ansD: '',
				ansRight: null
			});
		} else {
			this.setState({
				isWaiting: false,
				questionIndex: 0,
				question: '',
				ansA: '',
				ansB: '',
				ansC: '',
				ansD: '',
				ansRight: null,
				ansRightArr: [],
				questionSet: []
			});
		}
	};

	handleQuestionChange = (e) => {
		this.setState({ question: e.target.value });
	};

	handleAChange = (e) => {
		this.setState({ ansA: e.target.value });
	};

	handleBChange = (e) => {
		this.setState({ ansB: e.target.value });
	};

	handleCChange = (e) => {
		this.setState({ ansC: e.target.value });
	};

	handleDChange = (e) => {
		this.setState({ ansD: e.target.value });
	};

	handleRightSelect = (e) => {
		this.setState({ ansRight: Number(e.target.value) });
	};

	render() {
		const { isWaiting, questionIndex, question, ansA, ansB, ansC, ansD, ansRight } = this.state;
		const { isShow } = this.props;
		return (
			<div className="hw-modal-submit">
				<Dialog
					open={isShow}
					onClose={this.handleCloseCreateQuestion}
					aria-labelledby="form-dialog-title"
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle id="form-dialog-title" style={styles.deadlineModal.dialogTitle}>
						<div>
							<b>Tạo câu hỏi</b>
						</div>
						<IconButton
							disabled={isWaiting}
							style={styles.deadlineModal.dialogClose}
							aria-label="Close"
							onClick={this.handleCloseCreateQuestion}
						>
							<Close />
						</IconButton>
					</DialogTitle>
					<QuesItem
						valueSel={ansRight}
						questionIndex ={questionIndex}
						question={question}
						ansA={ansA}
						ansB={ansB}
						ansC={ansC}
						ansD={ansD}
						handleRightSelect={this.handleRightSelect}
						handleQuestionChange={this.handleQuestionChange}
						handleAChange={this.handleAChange}
						handleBChange={this.handleBChange}
						handleCChange={this.handleCChange}
						handleDChange={this.handleDChange}
					/>
					<DialogActions>
						{isWaiting && <Loading />}
						<Button disabled={isWaiting} onClick={this.handleCloseCreateQuestion} color="primary">
							<b>Đóng</b>
						</Button>
						<Button
							disabled={isWaiting || questionIndex === 9}
							variant="contained"
							color="primary"
							onClick={this.handleNextQuestion}
						>
							<b style={{ color: 'white' }}>Tiếp theo</b>
						</Button>
						<Button
							disabled={isWaiting}
							variant="contained"
							color="primary"
							onClick={this.handleSumbitQuestion}
						>
							<b style={{ color: 'white' }}>Tạo bộ câu hỏi</b>
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

const QuesItem = (props) => {
	return (
		<DialogContent style={styles.deadlineModal.dialogContent}>
			<DialogContentText color="secondary">
				<b>*Câu {props.questionIndex + 1}</b>
			</DialogContentText>
			<div className="ques-create-item">
				<div className="ques-item-title">
					<TextField
						onChange={props.handleQuestionChange}
						value={props.question}
						variant="outlined"
						margin="dense"
						id="contentSubmit"
						label="Nhập câu hỏi"
						type="text"
						fullWidth
					/>
				</div>
				<div className="ques-item-answer row">
					<div className="col-12 col-sm-6 col-md-6 config-size-A2 config-sel-item d-flex align-items-center margin-custom">
						<Radio
							checked={props.valueSel === 0}
							onChange={props.handleRightSelect}
							value={0}
							color="default"
							name="radio-button"
							disableRipple
							style={styles.radioCustom}
							icon={<RadioButtonUnchecked />}
							checkedIcon={<RadioButtonChecked />}
						/>
						<TextField
							onChange={props.handleAChange}
							value={props.ansA}
							variant="outlined"
							margin="dense"
							id="contentSubmit"
							label="Nhập câu trả lời A"
							type="text"
							fullWidth
						/>
					</div>
					<div className="col-12 col-sm-6 col-md-6 config-size-A2 config-sel-item d-flex align-items-center margin-custom-1">
						<Radio
							checked={props.valueSel === 1}
							onChange={props.handleRightSelect}
							value={1}
							color="default"
							name="radio-button"
							disableRipple
							style={styles.radioCustom}
							icon={<RadioButtonUnchecked />}
							checkedIcon={<RadioButtonChecked />}
						/>
						<TextField
							onChange={props.handleBChange}
							value={props.ansB}
							variant="outlined"
							margin="dense"
							id="contentSubmit"
							label="Nhập câu trả lời B"
							type="text"
							fullWidth
						/>
					</div>
					<div className="col-12 col-sm-6 col-md-6 config-size-A2 config-sel-item d-flex align-items-center margin-custom">
						<Radio
							checked={props.valueSel === 2}
							onChange={props.handleRightSelect}
							value={2}
							color="default"
							name="radio-button"
							disableRipple
							style={styles.radioCustom}
							icon={<RadioButtonUnchecked />}
							checkedIcon={<RadioButtonChecked />}
						/>
						<TextField
							onChange={props.handleCChange}
							value={props.ansC}
							variant="outlined"
							margin="dense"
							id="contentSubmit"
							label="Nhập câu trả lời C"
							type="text"
							fullWidth
						/>
					</div>
					<div className="col-12 col-sm-6 col-md-6 config-size-A2 config-sel-item d-flex align-items-center margin-custom-1">
						<Radio
							checked={props.valueSel === 3}
							onChange={props.handleRightSelect}
							value={3}
							color="default"
							name="radio-button"
							disableRipple
							style={styles.radioCustom}
							icon={<RadioButtonUnchecked />}
							checkedIcon={<RadioButtonChecked />}
						/>
						<TextField
							onChange={props.handleDChange}
							value={props.ansD}
							variant="outlined"
							margin="dense"
							id="contentSubmit"
							label="Nhập câu trả lời D"
							type="text"
							fullWidth
						/>
					</div>
				</div>
			</div>
		</DialogContent>
	);
};

const styles = {
	deadlineModal: {
		dialogTitle: {
			position: 'relative'
		},
		dialogContent: {
			height: 400
		},
		dialogClose: {
			position: 'absolute',
			top: 0,
			right: 0
		},
		textField: {
			border: '1px solid #000000'
		}
	}
};

export default connect(null, actions)(ModalQuestion);
