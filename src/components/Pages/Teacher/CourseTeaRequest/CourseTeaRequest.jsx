import React, { Component, PureComponent } from "react";
import "./CourseTeaRequest.css";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from 'react-redux';
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Paper,
  TableCell,
  TableSortLabel,
  Toolbar,
  Tooltip,
  IconButton,
  Button,
  Fab
} from "@material-ui/core";
import { AutoSizer, Column, SortDirection, Table } from "react-virtualized";
import { FilterList, Delete, Check } from "@material-ui/icons";

import WebService from '../../../../services/WebService';
import * as actions from '../../../../actions';

import docIco from "../../../../assets/images/ico/doc-ico.svg";

class CourseTeaRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deadlineSel: {},
      isWaiting: false
    };
    this.webService = new WebService();
    this.rows = [];
    this.id = 0;
    this.typeAction = null;
  }

  componentWillMount() {
    this.callApiGetRequestList();
  }

  callApiGetRequestList = async () => {
    this.setState({ isWaiting: true });
    const courseId = this.props.courseDetailData.CourseId;
    const resApi = await this.webService.getListRequest(courseId);
    this.handleGetListRequestApi(resApi);
    this.setState({ isWaiting: false });
  }

  handleGetListRequestApi = (resApi) => {
    if (resApi){
      if (resApi.returnCode){
        if (resApi.returnCode === 0) {
          this.props.showNotice(resApi.returnMess, 0);
        } else {
          const data = resApi.data;
          this.createRequestListData(data);
        }
      }
    }
    
  };

  createRequestListData = (requestList) => {
    let requestListTemp = [];
		requestList.forEach((data, _) => {
			let dataTemp = {
        reqUserId: data.Id,
				reqName: data.Name,
				reqEmail: data.Email,
				reqState: "0"
			};
			requestListTemp.push(dataTemp);
		});
		this.rows = requestListTemp;
  }
  

  callApiAcceptRequest = async (userId) => {
    const courseId = this.props.courseDetailData.CourseId;
    const permission = this.props.courseDetailData.Permission;
    const resApi = await this.webService.acceptRequestJoin(userId, courseId, permission);
    this.handleAcceptRequestJoinApi(resApi);
  }

  handleAcceptRequestJoinApi = (resApi) => {
    if (resApi){
      if (resApi.returnCode){
        if (resApi.returnCode === 0) {
          this.props.showNotice(resApi.returnMess, 0);
        } else {
          this.props.showNotice(resApi.returnMess, 1);
          this.callApiGetRequestList();
        }
      }
    }
  };

  callApiDeniedRequest = async (userId) => {
    const courseId = this.props.courseDetailData.CourseId;
    const permission = this.props.courseDetailData.Permission;
    const resApi = await this.webService.deniedRequestJoin(userId, courseId, permission);
    this.handleDeniedRequestJoinApi(resApi);
  }

  handleDeniedRequestJoinApi = (resApi) => {
    if (resApi){
      if (resApi.returnCode){
        if (resApi.returnCode === 0) {
          this.props.showNotice(resApi.returnMess, 0);
        } else {
          this.props.showNotice(resApi.returnMess, 1);
          this.callApiGetRequestList();
        }
      }
    }
  };


  handleChooseRequest = e => {
    e.event.preventDefault();
    if (this.typeAction !== null && this.typeAction !== undefined) {
      if (this.typeAction === 1) {
        const userId = e.rowData.reqUserId;
        this.callApiAcceptRequest(userId)
      } else if (this.typeAction === 0) {
        const userId = e.rowData.reqUserId;
        this.callApiDeniedRequest(userId)
      }
      this.typeAction = null;
    }
  };

  handleAcceptRequest = () => {
    this.typeAction = 1;
  };

  handleDeniedRequest = () => {
    this.typeAction = 0;
  };

  render() {
    const rows = this.rows;
    return (
      <div className="course-teacher-request">
        <Paper style={{ height: 450, width: "100%" }}>
          <RequestToolbar />
          <div style={{ width: "100%", height: "100%" }}>
            <WrappedVirtualizedTable
              acceptReq={this.handleAcceptRequest}
              deniedReq={this.handleDeniedRequest}
              rowCount={rows.length}
              rowGetter={({ index }) => rows[index]}
              onRowClick={this.handleChooseRequest}
              columns={[
                {
                  width: 150,
                  flexGrow: 1.0,
                  label: "Học sinh",
                  dataKey: "reqName"
                },
                {
                  width: 150,
                  flexGrow: 1.0,
                  label: "Email",
                  dataKey: "reqEmail"
                },
                {
                  width: 150,
                  flexGrow: 1.0,
                  label: "Trạng thái",
                  dataKey: "reqState"
                },
                {
                  width: 200,
                  flexGrow: 1.0,
                  label: "Thao tác",
                  dataKey: "reqAction"
                }
              ]}
            />
          </div>
        </Paper>
      </div>
    );
  }
}

class RequestTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deadlineDetail: ""
    };
  }

  handleAcceptRequest = () => {
    this.props.acceptReq();
  };

  handleDeniedRequest = () => {
    this.props.deniedReq();
  };

  getRowClassName = ({ index }) => {
    const { classes, rowClassName, onRowClick } = this.props;
    return classNames(
      classes.tableRow,
      classes.flexContainer,
      rowClassName,
      {
        [classes.tableRowHover]: index !== -1 && onRowClick != null
      },
      {
        [classes.tableRowCustom]: index === -1
      }
    );
  };

  cellRenderer = ({ cellData, columnIndex = null }) => {
    const { classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={classNames(
          classes.tableCell,
          classes.flexContainer,
          classes.tableCustom,
          {
            [classes.noClick]: onRowClick == null
          },
          {
            [classes.tableCellCustom] : columnIndex === 0
          }
        )}
        variant="body"
        style={{ height: rowHeight }}
        align="justify"
      >
        {columnIndex === 0 && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              style={{ width: "35px", height: "35px", margin: "0 0.5em" }}
              src={docIco}
              alt=""
            />
            {cellData}
          </div>
        )}
        {columnIndex === 2 && (
          <div>
            <Button
              disableTouchRipple
              disableFocusRipple
              disableRipple
              variant="contained"
              color="secondary"
            >
              Chờ xử lí
            </Button>
          </div>
        )}
        {columnIndex === 3 && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Chấp nhận">
              <Fab
                className={classNames(classes.action)}
                size="small"
                color="primary"
                onClick={this.handleAcceptRequest}
              >
                <Check />
              </Fab>
            </Tooltip>
            <Tooltip title="Từ chối">
              <Fab
                className={classNames(classes.action)}
                size="small"
                color="secondary"
                onClick={this.handleDeniedRequest}
              >
                <Delete />
              </Fab>
            </Tooltip>
          </div>
        )}
        {columnIndex !== 0 &&
          columnIndex !== 2 &&
          columnIndex !== 3 &&
          cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
    const { headerHeight, columns, classes, sort } = this.props;
    const direction = {
      [SortDirection.ASC]: "asc",
      [SortDirection.DESC]: "desc"
    };

    const inner =
      !columns[columnIndex].disableSort && sort != null ? (
        <TableSortLabel
          active={dataKey === sortBy}
          direction={direction[sortDirection]}
        >
          {label}
        </TableSortLabel>
      ) : (
          label
        );

    return (
      <TableCell
        component="div"
        className={classNames(
          classes.tableCell,
          classes.flexContainer,
          classes.tableHeader,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align="center"
      >
        {inner}
      </TableCell>
    );
  };

  render() {
    const { classes, columns, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            className={classes.table}
            height={385}
            width={width}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(
              (
                { cellContentRenderer = null, className, dataKey, ...other },
                index
              ) => {
                let renderer;
                if (cellContentRenderer != null) {
                  renderer = cellRendererProps =>
                    this.cellRenderer({
                      cellData: cellContentRenderer(cellRendererProps),
                      columnIndex: index
                    });
                } else {
                  renderer = this.cellRenderer;
                }

                return (
                  <Column
                    key={dataKey}
                    headerRenderer={headerProps =>
                      this.headerRenderer({
                        ...headerProps,
                        columnIndex: index
                      })
                    }
                    className={classNames(classes.flexContainer, className)}
                    cellRenderer={renderer}
                    dataKey={dataKey}
                    {...other}
                  />
                );
              }
            )}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const RequestToolbar = () => {
  return (
    <Toolbar style={styleToolbar.toolbarRoot}>
      <div style={styleToolbar.toolbarTitle}>
        <Typography variant="h6" id="tableTitle">
          Danh sách chờ
        </Typography>
      </div>
      <div style={styleToolbar.toolbarSpacer} />
      <div>
        <Tooltip title="Filter list">
          <IconButton aria-label="Filter list">
            <FilterList />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

const styles = theme => ({
  table: {
    fontFamily: theme.typography.fontFamily,
    outline: "none"
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box"
  },
  tableHeader: {
    background: "#73DB8C",
    fontWeight: "bold",
    fontSize: "0.9em",
    color: "#ffffff"
  },
  tableRow: {
    cursor: "default"
  },
  tableRowCustom: {
    cursor: "default",
    background: "#73DB8C"
  },
  tableRowHover: {
    // '&:hover': {
    //   backgroundColor: theme.palette.grey[200],
    // },
  },
  tableCell: {
    flex: 1,
    display: "flex",
    justifyContent: "center"
  },
  tableCellCustom: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start"
  },
  tableCustom: {
    outline: "none"
  },
  noClick: {
    cursor: "initial"
  },
  action: {
    marginLeft: "0.25em",
    marginRight: "0.25em"
  }
});

const styleToolbar = {
  toolbarRoot: {
    backgroundColor: "#73DB8C"
  },
  toolbarSpacer: {
    flex: "1 1 100%"
  },
  toolbarTitle: {
    flex: "0 0 auto"
  }
};

RequestTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      cellContentRenderer: PropTypes.func,
      dataKey: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  openDelPopup: PropTypes.func,
  rowClassName: PropTypes.string,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  sort: PropTypes.func
};

RequestTable.defaultProps = {
  headerHeight: 56,
  rowHeight: 56
};

const WrappedVirtualizedTable = withStyles(styles)(RequestTable);

export default connect(null, actions)(CourseTeaRequest);
