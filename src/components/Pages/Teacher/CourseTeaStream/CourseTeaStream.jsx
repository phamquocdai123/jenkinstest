import React, { Component } from "react";
import "./CourseTeaStream.css";
import { connect } from "react-redux";
import io from "socket.io-client";
import ReactPlayer from "react-player";
import SwipeableViews from "react-swipeable-views";
import {
  Paper,
  Tab,
  Tabs,
  AppBar,
  Dialog,
  Slide,
  Toolbar,
  IconButton,
  Typography,
  Switch,
  Button,
  FormControlLabel
} from "@material-ui/core";
import { QuestionAnswer, Message, Close, People } from "@material-ui/icons";

import * as actions from "../../../../actions";
import {
  STREAM_CONFIG_FULL,
  STREAM_CONFIG_OP2,
  PEER_CONFIG
} from "../../../../setting/ConstantConfig";

import CourseLiveChat from "./CourseLiveChat";
import CourseLiveQues from "./CourseLiveQues";
import CourseLiveUser from "./CourseLiveUser";

class CourseTeaStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localSrc: null,
      streamSrc: "stream",
      screenSrc: null,
      roomId: "",
      peerId: "",
      peerClientList: [],
      tabStreamIdx: 0,
      isSwitch: false,
      examNumQues: 0,
      examResult: [],
      surveyResult: [0, 0, 0, 0, 0],
      surveyQuestion: {
        question: "Bạn hiểu được bao nhiêu bài học?",
        AnswerA: "10% - 30%",
        AnswerB: "40% - 60%",
        AnswerC: "70% - 90%",
        AnswerD: "100%"
      }
    };
    this.getUserMedia = null;
    this.getScreenMedia = null;
    this.hostIO = null;
    this.peerConnectionDb = {};
    this.idExam = 0;
    this.isScreen = false;
    this.messArr = [];
    this.peerClientList = [];
    this.surveyResult = [0, 0, 0, 0, 0];
  }

  componentDidMount() {
    this.getMedia(STREAM_CONFIG_OP2);
    this.getMediaScreen();
  }

  destroyStream = async () => {
    await this.state.streamSrc.getTracks().forEach(track => track.stop());
  };

  getMediaScreen = async type => {
    if (navigator.getDisplayMedia) {
      this.getScreenMedia = await navigator
        .getDisplayMedia({ video: true })
        .then(stream => {
          this.handleScreenStream(stream, type);
        });
    } else if (navigator.mediaDevices.getDisplayMedia) {
      this.getScreenMedia = await navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then(stream => {
          this.handleScreenStream(stream, type);
        });
    } else {
      this.getScreenMedia = await navigator.mediaDevices
        .getUserMedia({ video: { mediaSource: "screen" } })
        .then(stream => {
          this.handleScreenStream(stream, type);
        });
    }
  };

  getMedia = async mediaConfig => {
    if (navigator.getUserMedia) {
      this.getUserMedia = await navigator.getUserMedia(
        mediaConfig,
        this.handleStreamSuc,
        this.handleStreamErr
      );
    } else if (navigator.webkitGetUserMedia) {
      this.getUserMedia = await navigator.webkitGetUserMedia(
        mediaConfig,
        this.handleStreamSuc,
        this.handleStreamErr
      );
    } else if (navigator.mozGetUserMedia) {
      this.getUserMedia = await navigator.mozGetUserMedia(
        mediaConfig,
        this.handleStreamSuc,
        this.handleStreamErr
      );
    }
  };

  handleStreamSuc = stream => {
    console.log(stream);
    const self = this;
    if (stream) {
      this.setState(
        { streamSrc: stream, localSrc: stream },
        () => {
          self.createSocket();
          self.processSocket();
          self.createRoomSocket();
        }
      );
    }
  };

  handleStreamErr = err => {
    console.log("Don't support socket IO");
  };

  handleScreenStream = async (stream, type) => {
    if (stream) {
      this.setState({ screenSrc: stream}, () => {
        this.isScreen = true;
        this.listenScreenStreamEnd();
      });
    }
  };

  refreshStream(peerId) {
    this.sendOfferToClient(peerId);
  }

  listenScreenStreamEnd = () => {
    const self = this;
    const screenStream = this.state.screenSrc;
    // const localStream = this.state.localSrc;
    screenStream.getVideoTracks()[0].addEventListener("ended", () => {
      // if (localStream.getTracks().length > 2)
      //   localStream.removeTrack(localStream.getVideoTracks()[1]);
      // if (this.state.stream !== null)
      // self.setState({ screenSrc: null, localSrc: this.state.stream });
      self.isScreen = false;
    });
  };

  //Socket IO method
  createSocket = () => {
    this.hostIO = io(PEER_CONFIG.URL);
  };

  processSocket = () => {
    if (this.hostIO !== null) {
      this.hostIO.on("id", this.handleIdSocket);
      this.hostIO.on("getlivestreamoffer", this.handleOfferReq);
      this.hostIO.on("offer", this.handleOfferClient);
      this.hostIO.on("answer", this.handleAnswerRes);
      this.hostIO.on("candidate", this.handleCandidateConfig);
      this.hostIO.on("serverbroadcastcomment", this.handleMessChat);
      this.hostIO.on("surveyresult", this.handleSurveyResult);
      this.hostIO.on("finalresult", this.handleExamResult);
      this.hostIO.on("StudentHandUp", this.handleStudentHandUp);
      this.hostIO.on("ClientDisconnect", this.handleClientDisconnect);
    }
  };

  handleIdSocket = id => {
    console.log(id + "create room");
    this.setState({ peerId: id });
  };

  //Create offer request to client peer
  handleOfferReq = peerClient => {
    const userData = peerClient.userName.split("#");
    const peerData = {
      id: peerClient.id,
      name: userData[0],
      platform:
        userData[1] === platform.MOBILE ? platform.MOBILE : platform.WEB,
      handUp: false,
      mic: false,
      liveObj: this.createStudentEle(peerClient.id)
    };
    this.peerClientList.push(peerData);
    this.setState({ peerClientList: this.peerClientList }, () => {
      this.sendOfferToClient(peerClient.id);
    });
  };

  handleOfferClient = data => {
    console.log("receive from client");
    const peerClientId = data.peerId;
    let pc =
      this.peerConnectionDb[peerClientId] ||
      this.createPeerClient(peerClientId);
    pc.setRemoteDescription(
      new RTCSessionDescription(data.offer),
      function () { },
      () => { }
    );
    this.createAnswerToClient(pc, peerClientId);
  };

  createAnswerToClient = (pc, peerClientId) => {
    const self = this;
    const roomId = this.props.courseDetailData.Code;
    pc.createAnswer(
      function (sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        let data = {
          roomName: roomId,
          peerClientId: peerClientId,
          answer: sessionDescription,
          type: "0"
        };
        self.hostIO.emit("answer", data);
      },
      () => { }
    );
  };

  sendOfferToClient = async peerClientId => {
    let pc =
      this.peerConnectionDb[peerClientId] ||
      this.createPeerClient(peerClientId);
    this.addStreamToClient(pc);
    this.createOfferToClient(peerClientId);
  };

  addStreamToClient = (pc) => {
    if (this.state.localSrc) {
      !!pc.getLocalStreams().length &&
        pc.removeStream(this.state.localSrc);
      pc.addStream(this.state.localSrc);
    }
  };

  // createLocalStreamMobile = () => {
  //   const streamSrc = this.state.localSrcMobile;
  //   if (streamSrc.getTracks().length > 2) {
  //     streamSrc.removeTrack(streamSrc.getVideoTracks()[1]);
  //     this.setState({ localSrcMobile: streamSrc });
  //   }
  // };

  //Switch stream op1
  // createLocalStreamWeb = () => {
  //   const streamSrc = this.state.localSrcWeb;
  //   if (this.state.screenSrc !== null) {
  //     const screenTrack = this.state.screenSrc.getVideoTracks()[0];
  //     streamSrc.addTrack(screenTrack);
  //     this.setState({ localSrcWeb: streamSrc });
  //   }
  // };

  //Switch stream op2
  createLocalScreen = async (peerId, index) => {
    const screenSrc = this.state.screenSrc;
    const audioTrack = this.state.streamSrc.getAudioTracks()[0];
    screenSrc.addTrack(audioTrack);
    if (this.peerClientList[index].platform === platform.MOBILE) {
      await this.refreshClient(peerId);
      this.setState({ localSrc: screenSrc }, () => {
        this.sendOfferToClient(peerId);
      });
    } else {
      // op2 for web
      const peer = this.peerConnectionDb[peerId];
      peer.removeStream(this.state.localSrc);
      this.setState({ localSrc: screenSrc }, () => {
        peer.addStream(this.state.localSrc);
        this.createOfferToClient(peerId);
      });
    }
  };

  createLocalLive = async (peerId, index) => {
    const streamSrc = this.state.streamSrc;
    if (this.peerClientList[index].platform === platform.MOBILE) {
      await this.refreshClient(peerId);
      this.setState({ localSrc: streamSrc }, () => {
        this.sendOfferToClient(peerId);
      });
    } else {
      // op2 for web
      const peer = this.peerConnectionDb[peerId];
      peer.removeStream(this.state.localSrc);
      if (this.isScreen === false)
        this.setState({screenSrc: null});
      this.setState({ localSrc: streamSrc }, () => {
        peer.addStream(this.state.localSrc);
        this.createOfferToClient(peerId);
      });
    }
  };

  createOfferToClient = peerClientId => {
    const self = this;
    let pc = this.peerConnectionDb[peerClientId];
    pc.createOffer(sessionDescription => {
      self.handleCreateOfferSuc(sessionDescription, pc, peerClientId);
    }, self.handleCreateOfferErr);
  };

  handleCreateOfferSuc = (sessionDescription, pc, peerClientId) => {
    if (pc) {
      let data = {
        socketId: peerClientId,
        offer: sessionDescription
      };
      pc.setLocalDescription(sessionDescription);
      this.hostIO.emit("sendlivestreamoffer", data);
    }
  };

  handleCreateOfferErr = err => {
    console.log(err);
  };

  //Set answer result from client peer
  handleAnswerRes = ansResult => {
    let peerClientId = ansResult.socketId;
    if (ansResult) {
      let pc =
        this.peerConnectionDb[peerClientId] ||
        this.createPeerClient(peerClientId);
      console.log(this.peerConnectionDb);
      pc.setRemoteDescription(
        new RTCSessionDescription(ansResult.answer),
        () => { },
        () => { }
      );
    }
  };

  //Set candidate Ice config from client peer
  handleCandidateConfig = candidateResult => {
    let peerClientId = candidateResult.socketId;
    let pc =
      this.peerConnectionDb[peerClientId] ||
      this.createPeerClient(peerClientId);
    if (pc.remoteDescription) {
      pc.addIceCandidate(
        new RTCIceCandidate({
          sdpMLineIndex: candidateResult.payload.label,
          sdpMid: candidateResult.payload.id,
          candidate: candidateResult.payload.candidate
        }),
        () => { },
        () => { }
      );
    }
  };

  //Create peer client object
  createPeerClient = peerClientId => {
    let peer = new RTCPeerConnection(
      PEER_CONFIG.CONNECTION,
      PEER_CONFIG.CONSTRAINTS,
      PEER_CONFIG.SDP
    );
    peer.onaddstream = async event => {
      console.log("receive audio");
      let peerElement = document.getElementById(peerClientId);
      peerElement.srcObject = await event.stream;
      peerElement.volume = 0.2;
    };

    peer.onremovestream = function (event) {
      this.setState({ streamSrc: "" });
    };
    peer.ontrack = event => {
      console.log(event);
    };
    peer.oniceconnectionstatechange = function (event) {
      switch (
      (event.srcElement || event.target).iceConnectionState // Chrome // Firefox
      ) {
        case "disconnected":
          break;
        case "closed":
          break;
        default:
          break;
      }
    };
    peer.onnegotiationneeded = event => {
      console.log(event);
    };
    this.peerConnectionDb[peerClientId] = peer;
    return peer;
  };

  createRoomSocket = () => {
    if (this.hostIO) {
      const roomId = this.props.courseDetailData.Code;
      this.hostIO.emit("createroom", roomId);
    }
  };

  //Send mess chat to server
  createSendMessChat = dataMess => {
    if (dataMess) {
      this.hostIO.emit("usercomment", dataMess);
    }
  };

  createSendQuesExam = dataQues => {
    this.hostIO.emit("createquestion", dataQues);
  };

  createSendQuesSurvey = () => {
    const surveyData = {
      Question: this.state.surveyQuestion.question,
      Time: 10,
      AnswerA: this.state.surveyQuestion.AnswerA,
      AnswerB: this.state.surveyQuestion.AnswerB,
      AnswerC: this.state.surveyQuestion.AnswerC,
      AnswerD: this.state.surveyQuestion.AnswerD
    };
    this.hostIO.emit("createsurvey", surveyData);
  };

  createStudentEle = peerId => {
    return <audio id={peerId} autoPlay controls hidden muted />;
  };

  handleMessChat = data => {
    this.messArr.push(data);
    this.props.updateChat(this.messArr);
  };

  handleExamNumQues = examNumQues => {
    this.setState({ examNumQues });
  };

  handleExamResult = data => {
    let examResult = [];
    let examResultObj = {
      studentName: data.name,
      numberQues: this.state.examNumQues,
      correctAns: data.score
    };
    examResult.push(examResultObj);
    this.setState({ examResult });
  };

  handleFinishExam = () => {
    this.hostIO.emit("finishedquizz");
  };

  handleSurveyResult = data => {
    switch (data) {
      case "A":
        this.surveyResult[1] = this.surveyResult[1] + 1;
        break;
      case "B":
        this.surveyResult[2] = this.surveyResult[2] + 1;
        break;
      case "C":
        this.surveyResult[3] = this.surveyResult[3] + 1;
        break;
      case "D":
        this.surveyResult[4] = this.surveyResult[4] + 1;
        break;
      default:
        this.surveyResult[0] = this.surveyResult[0] + 1;
        break;
    }
    this.setState({ surveyResult: this.surveyResult });
  };

  handleStudentHandUp = peerId => {
    for (let index = 0; index < this.peerClientList.length; index++) {
      if (peerId === this.peerClientList[index].id) {
        this.peerClientList[index].handUp = true;
      }
    }
    this.setState({ peerClientList: this.peerClientList });
  };

  handleControlAudio = async peerId => {
    let index = null;
    const audioSelect = document.getElementById(peerId);
    const peerClientSelect = await this.peerClientList.filter((data, idx) => {
      if (data.id === peerId) {
        index = idx;
        return data.id === peerId;
      }
    });
    if (index !== null) {
      if (peerClientSelect[0].mic === true) {
        peerClientSelect[0].handUp = false;
        peerClientSelect[0].mic = false;
        audioSelect.muted = true;
      } else {
        peerClientSelect[0].mic = true;
        audioSelect.muted = false;
      }
      this.peerClientList[index] = peerClientSelect[0];
      this.setState({ peerClientList: this.peerClientList });
    }
  };

  handleClientDisconnect = peerClientId => {
    this.removeClient(peerClientId);
  };

  handleChangeTab = (event, index) => {
    this.setState({ tabStreamIdx: index });
  };

  refreshClient = async peerClientId => {
    await this.peerConnectionDb[peerClientId].close();
    delete this.peerConnectionDb[peerClientId];
  };

  removeClient = async peerClientId => {
    await this.peerConnectionDb[peerClientId].close();
    this.peerClientList = await this.peerClientList.filter(data => {
      return data.id !== peerClientId;
    });
    this.setState({ peerClientList: this.peerClientList });
    delete this.peerConnectionDb[peerClientId];
  };

  handleChangeMediaStream = async () => {
    const data = this.peerClientList;
    if (this.state.isSwitch === false) {
      if (this.state.screenSrc === null) {
        this.props.showNotice("Bạn vui lòng chia sẻ một màn hình của bạn", 0);
        return;
      }
      for (let index = 0; index < data.length; index++) {
        console.log(index)
        // if (data[index].platform === platform.WEB) {
        //   //Switch stream op1 for web
        //   const dataStream = {
        //     peerId: data[index].id,
        //     type: "1"
        //   };
        //   this.hostIO.emit("switchstream", dataStream);
        // } else {
        //   //Switch stream op2 for mobile
        //   this.hostIO.emit("switch", data[index].id);
        //   this.createLocalScreen(data[index].id, index);
        // }
        this.hostIO.emit("switch", data[index].id);
        this.createLocalScreen(data[index].id, index);
      }
    } else {
      for (let index = 0; index < data.length; index++) {
        console.log(index)

        // if (data[index].platform === platform.WEB) {
        //   console.log('switch')
        //   //Switch stream op1 for web
        //   const dataStream = {
        //     peerId: data[index].id,
        //     type: "0"
        //   };
        //   this.hostIO.emit("switchstream", dataStream);
        // } else {
        //   //Switch stream op2 mobile
        //   this.hostIO.emit("switch", data[index].id);
        //   this.createLocalLive(data[index].id, index);
        // }
        this.hostIO.emit("switch", data[index].id);
        this.createLocalLive(data[index].id, index);
      }
    }
    this.setState({ isSwitch: !this.state.isSwitch });
  };

  handleCloseLive = async () => {
    if (this.state.streamSrc) {
      this.destroyStream();
    }
    if (this.hostIO) {
      this.hostIO.close();
    }
    if (this.peerClientList){
     await this.peerClientList.forEach( async data => {
        await this.peerConnectionDb[data.id].close();
      })
      this.peerClientList = [];
      this.peerConnectionDb = null;
    }
    this.props.destroyChat();
    this.props.handleCloseLive();
  };

  handleScreenSharingClick = () => {
    const type = 1;
    if (this.state.screenSrc !== null) {
      return;
    }
    this.getMediaScreen(type);
  };

  render() {
    const {
      streamSrc,
      tabStreamIdx,
      isSwitch,
      examResult,
      surveyResult,
      peerClientList
    } = this.state;
    const { isLive } = this.props;
    return (
      <div className="course-teacher-stream">
        <Dialog fullScreen open={isLive} TransitionComponent={Transition}>
          <div style={styles.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Close"
                onClick={this.handleCloseLive}
              >
                <Close />
              </IconButton>
              <Typography variant="h6">Đang trực tuyến</Typography>
            </Toolbar>
          </div>
          <Paper elevation={4} style={styles.containerStream}>
            <div className="d-flex flex-row justify-content-center h-100 stream-container">
              <div className="course-live-video">
                <Button
                  style={styles.screenControl}
                  variant="contained"
                  color="primary"
                  onClick={this.handleScreenSharingClick}
                >
                  <b>Chia sẻ màn hình</b>
                </Button>
                <FormControlLabel
                  style={styles.streamControl}
                  control={
                    <Switch
                      checked={isSwitch}
                      value={isSwitch}
                      onChange={this.handleChangeMediaStream}
                    />
                  }
                  label={isSwitch ? <b>Màn hình</b> : <b>Khuôn mặt</b>}
                />
                <ReactPlayer
                  url={streamSrc}
                  playing={streamSrc === "stream" ? false : true}
                  controls={true}
                  width="100%"
                  height="100%"
                  muted
                  pip={true}
                />
              </div>
              <div className="course-live-action">
                <AppBar
                  position="static"
                  style={{
                    marginLeft: "0.5em",
                    marginRight: "0.5em",
                    marginTop: "-0.1em",
                    width: "100%",
                    borderRadius: "6px",
                    maxWidth: "1400px",
                    zIndex: "0",
                    backgroundColor: "#ff000080",
                    color: "white"
                  }}
                >
                  <Tabs
                    value={tabStreamIdx}
                    onChange={this.handleChangeTab}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="inherit"
                    centered={true}
                  >
                    <Tab
                      style={{ fontWeight: "bold" }}
                      label="Chat"
                      icon={<Message />}
                    />
                    <Tab
                      style={{ fontWeight: "bold" }}
                      label="Kiểm tra"
                      icon={<QuestionAnswer />}
                    />
                    <Tab
                      style={{ fontWeight: "bold" }}
                      label="Tham gia"
                      icon={<People />}
                    />
                  </Tabs>
                </AppBar>
                <SwipeableViews
                  index={tabStreamIdx}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "1400px",
                    marginLeft: "0.5em",
                    marginRight: "0.5em"
                  }}
                  slideStyle={{ height: "100%" }}
                  containerStyle={{ height: "100%" }}
                >
                  <CourseLiveChat sendDataMess={this.createSendMessChat} />
                  <CourseLiveQues
                    examNumQues={this.handleExamNumQues}
                    sendDataQues={this.createSendQuesExam}
                    sendDataSurvey={this.createSendQuesSurvey}
                    sendFinishExam={this.handleFinishExam}
                    recvDataResult={examResult}
                    surveyResult={surveyResult}
                  />
                  <CourseLiveUser
                    peerClientList={peerClientList}
                    controlAudio={this.handleControlAudio}
                  />
                </SwipeableViews>
              </div>
            </div>
          </Paper>
        </Dialog>
      </div>
    );
  }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = {
  appBar: {
    background: "linear-gradient(to right, #027C76 0%, #02BF99 70%)"
  },
  containerStream: {
    height: "95%",
    overflowY: "hidden",
    marginBottom: "0.25em",
    marginTop: "0.25em"
  },
  streamControl: {
    position: "absolute",
    top: "0",
    right: "0",
    zIndex: "1"
  },
  screenControl: {
    position: "absolute",
    top: "0.5em",
    right: "150px",
    zIndex: "1",
    color: "#fff",
    textTransform: "unset"
  }
};

const platform = {
  WEB: "1",
  MOBILE: "2"
};

export default connect(
  null,
  actions
)(CourseTeaStream);
