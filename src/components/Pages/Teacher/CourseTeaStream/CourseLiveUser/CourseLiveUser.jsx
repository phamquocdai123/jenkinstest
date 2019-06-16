import React, { Component } from "react";
import "./CourseLiveUser.css";

import { Typography, Divider, IconButton } from "@material-ui/core";
import studentIco from "../../../../../assets/images/ico/student.svg";
import handDisIco from "../../../../../assets/images/ico/hand-dis.svg";
import handEnaIco from "../../../../../assets/images/ico/hand-ena.svg";
import micOffIco from "../../../../../assets/images/ico/mic-off.svg";
import micOnIco from "../../../../../assets/images/ico/mic-on.svg";

class CourseLiveUser extends Component {
  controlAudio = (e, id) => {
    e.preventDefault();
    this.props.controlAudio(id);
  }
  render() {
    const { peerClientList } = this.props;
    return (
      <div className="course-live-user">
        {peerClientList.length > 0 ? (
          peerClientList.map((data, index) => {
            return <StudentItem key={data.id} data={data} controlAudio={this.controlAudio} />;
          })
        ) : (
          <Typography variant="h6">Học sinh chưa tham gia</Typography>
        )}
      </div>
    );
  }
}

const StudentItem = props => {
  return (
    <div className="student mb-4">
      <div className="student-element">{props.data.liveObj}</div>
      <div className="student-info d-flex align-items-center mb-1">
        <div className="student-info-name d-flex align-items-center">
          <img src={studentIco} alt="" width={30} height={30} />
          <span>{props.data.name}</span>
        </div>
        <div className="student-info-action d-flex align-items-center">
          <IconButton>
            {props.data.handUp === false ? (
              <img src={handDisIco} alt="" width={30} height={30} />
            ) : (
              <img src={handEnaIco} alt="" width={30} height={30} />
            )}
          </IconButton>
          <IconButton onClick={(e, id = props.data.id) => props.controlAudio(e,id)}>
            {props.data.mic === false ? (
              <img src={micOffIco} alt="" width={30} height={30} />
            ) : (
              <img src={micOnIco} alt="" width={30} height={30} />
            )}
          </IconButton>
        </div>
      </div>
      <Divider variant="fullWidth" />
    </div>
  );
};

export default CourseLiveUser;
