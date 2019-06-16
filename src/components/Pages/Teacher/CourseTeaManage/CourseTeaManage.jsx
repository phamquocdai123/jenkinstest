import React, { Component, PureComponent } from 'react';
import './CourseTeaManage.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
	Typography,
	Paper,
	TableCell,
	TableSortLabel,
	Toolbar,
	Tooltip,
	IconButton,
	Fab,
	Avatar,
	Select,
	FormControl,
	MenuItem
} from '@material-ui/core';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import { FilterList, Delete } from '@material-ui/icons';

import WebService from '../../../../services/WebService';
import * as actions from '../../../../actions';

class CourseTeaManage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deadlineSel: {},
			rows: []
		};
		this.webService = new WebService();
		this.rows = [];
    this.id = 0;
    this.rollId = null;
		this.typeAction = null;
	}

	componentWillMount() {
		this.callApiGetMemberList();
	}

	callApiGetMemberList = async () => {
		this.setState({ isWaiting: true });
		const courseId = this.props.courseDetailData.CourseId;
		const resApi = await this.webService.getListMember(courseId);
		this.handleGetListMemberApi(resApi);
		this.setState({ isWaiting: false });
	};

	handleGetListMemberApi = (resApi) => {
		if (resApi) {
			if (resApi.returnCode) {
				if (resApi.returnCode === 0) {
					this.props.showNotice(resApi.returnMess, 0);
				} else {
					const data = resApi.data;
					console.log(data);
					this.createEnrollListData(data);
				}
			}
		}
	};

	createEnrollListData = (enrollList) => {
		let enrollListTemp = [];
		enrollList.forEach((data, _) => {
			let dataTemp = {
				enrollUserId: data.Id,
				enrollAvatar: data.Avatar,
				enrollName: data.Name,
				enrollPhone: data.PhoneNumber,
				enrollEmail: data.Email,
				enrollState: data.Permission
			};
			enrollListTemp.push(dataTemp);
		});
		this.setState({ rows: enrollListTemp });
		this.rows = enrollListTemp;
  };
  
  callApiChangePermission = async (userId) => {
		const courseId = this.props.courseDetailData.CourseId;
    const permission = this.rollId;
    console.log(permission)
		const resApi = await this.webService.changePermission(courseId, userId , permission);
		this.handleChangePermissionApi(resApi);
  };
  
  handleChangePermissionApi = (resApi) => {
    if (resApi){
      if (resApi.returnCode){
        if (resApi.returnCode === 0) {
          this.props.showNotice(resApi.returnMess, 0);
        } else {
          this.props.showNotice(resApi.returnMess, 1);
          this.callApiGetMemberList();
        }
      }
    }
  }

	callApiRemoveStudent = async (userId) => {
		const courseId = this.props.courseDetailData.CourseId;
		const resApi = await this.webService.removeMember(courseId, userId);
		this.handleRemoveStudentApi(resApi);
  };
  
  handleRemoveStudentApi = (resApi) => {
    if (resApi){
      if (resApi.returnCode){
        if (resApi.returnCode === 0) {
          this.props.showNotice(resApi.returnMess, 0);
        } else {
          this.props.showNotice(resApi.returnMess, 1);
          this.callApiGetMemberList();
        }
      }
    }
  }

	handleChooseRequest = (e) => {
		e.event.preventDefault();
		if (this.typeAction !== null && this.typeAction !== undefined) {
			if (this.typeAction === 1) {
				const userId = e.rowData.enrollUserId;
				this.callApiChangePermission(userId);
			} else if (this.typeAction === 0) {
				const userId = e.rowData.enrollUserId;
				this.callApiRemoveStudent(userId);
			}
			this.typeAction = null;
		}
  };
  
	handleRemoveStudent = () => {
		this.typeAction = 0;
  };
  
  handleChangeRoll = (rollId) => {
    this.rollId = rollId;
    this.typeAction = 1;
  }

	render() {
		const { rows } = this.state;
		return (
			<div className="course-teacher-manage">
				<Paper style={{ height: 450, width: '100%' }}>
					<ManageToolbar />
					<div style={{ width: '100%', height: '100%' }}>
						<WrappedVirtualizedTable
              removeStudent={this.handleRemoveStudent}
              changeRoll={this.handleChangeRoll}
							rowCount={rows.length}
							rowGetter={({ index }) => rows[index]}
							onRowClick={this.handleChooseRequest}
							columns={[
								{
									width: 10,
									display: 'none',
									flexGrow: 1.0,
									label: '',
									dataKey: 'enrollAvatar'
								},
								{
									width: 150,
									flexGrow: 1.0,
									label: 'Học sinh',
									dataKey: 'enrollName'
								},
								{
									width: 150,
									flexGrow: 1.0,
									label: 'SĐT',
									dataKey: 'enrollPhone'
								},
								{
									width: 150,
									flexGrow: 1.0,
									label: 'Email',
									dataKey: 'enrollEmail'
								},
								{
									width: 150,
									flexGrow: 1.0,
									label: 'Trạng thái',
									dataKey: 'enrollState'
								},
								{
									width: 200,
									flexGrow: 1.0,
									label: 'Thao tác',
									dataKey: 'enrollction'
								}
							]}
						/>
					</div>
				</Paper>
			</div>
		);
	}
}

class ManageTable extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			deadlineDetail: ''
		};
	}

	handleRemoveStudent = () => {
		this.props.removeStudent();
	};

	handleChangeRoll = (e) => {
    const rollId = e.target.value;
    this.props.changeRoll(rollId);
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
						[classes.tableCellCustom]: columnIndex === 0
					}
				)}
				variant="body"
				style={{ height: rowHeight }}
				align="justify"
			>
				{columnIndex === 0 && (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Avatar alt="Remy Sharp" src={cellData} className={classes.avatar} />
					</div>
				)}
				{columnIndex === 1 && (
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
						{cellData}
					</div>
				)}
				{columnIndex === 4 && (
					<FormControl variant="outlined">
						<Select
							variant="outlined"
							value={cellData}
							onChange={this.handleChangeRoll}
							inputProps={{
								name: 'roll'
							}}
						>
							<MenuItem value={1}>Giáo viên</MenuItem>
							<MenuItem value={0}>Học sinh</MenuItem>
						</Select>
					</FormControl>
				)}
				{columnIndex === 5 && (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Tooltip title="Xoá">
							<Fab
								className={classNames(classes.action)}
								size="small"
								color="secondary"
								onClick={this.handleRemoveStudent}
							>
								<Delete />
							</Fab>
						</Tooltip>
					</div>
				)}
				{columnIndex !== 0 && columnIndex !== 1 && columnIndex !== 4 && cellData}
			</TableCell>
		);
	};

	headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
		const { headerHeight, columns, classes, sort } = this.props;
		const direction = {
			[SortDirection.ASC]: 'asc',
			[SortDirection.DESC]: 'desc'
		};

		const inner =
			!columns[columnIndex].disableSort && sort != null ? (
				<TableSortLabel active={dataKey === sortBy} direction={direction[sortDirection]}>
					{label}
				</TableSortLabel>
			) : (
				label
			);

		return (
			<TableCell
				component="div"
				className={classNames(classes.tableCell, classes.flexContainer, classes.tableHeader, classes.noClick)}
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
						{columns.map(({ cellContentRenderer = null, className, dataKey, ...other }, index) => {
							let renderer;
							if (cellContentRenderer != null) {
								renderer = (cellRendererProps) =>
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
									headerRenderer={(headerProps) =>
										this.headerRenderer({
											...headerProps,
											columnIndex: index
										})}
									className={classNames(classes.flexContainer, className)}
									cellRenderer={renderer}
									dataKey={dataKey}
									{...other}
								/>
							);
						})}
					</Table>
				)}
			</AutoSizer>
		);
	}
}

const ManageToolbar = () => {
	return (
		<Toolbar style={styleToolbar.toolbarRoot}>
			<div style={styleToolbar.toolbarTitle}>
				<Typography variant="h6" id="tableTitle">
					Danh sách sinh viên tham gia
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

const styles = (theme) => ({
	table: {
		fontFamily: theme.typography.fontFamily,
		outline: 'none'
	},
	flexContainer: {
		display: 'flex',
		alignItems: 'center',
		boxSizing: 'border-box'
	},
	tableHeader: {
		background: '#73DB8C',
		fontWeight: 'bold',
		fontSize: '0.9em',
		color: '#ffffff'
	},
	tableRow: {
		cursor: 'default'
	},
	tableRowCustom: {
		cursor: 'default',
		background: '#73DB8C'
	},
	tableRowHover: {
		// '&:hover': {
		//   backgroundColor: theme.palette.grey[200],
		// },
	},
	tableCell: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center'
	},
	tableCellCustom: {
		flex: 1,
		display: 'flex',
		justifyContent: 'flex-start'
	},
	tableCustom: {
		outline: 'none'
	},
	noClick: {
		cursor: 'initial'
	},
	action: {
		marginLeft: '0.25em',
		marginRight: '0.25em'
	}
});

const styleToolbar = {
	toolbarRoot: {
		backgroundColor: '#73DB8C'
	},
	toolbarSpacer: {
		flex: '1 1 100%'
	},
	toolbarTitle: {
		flex: '0 0 auto'
	}
};

ManageTable.propTypes = {
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
	rowHeight: PropTypes.oneOfType([ PropTypes.number, PropTypes.func ]),
	sort: PropTypes.func
};

ManageTable.defaultProps = {
	headerHeight: 56,
	rowHeight: 56
};

const WrappedVirtualizedTable = withStyles(styles)(ManageTable);

export default connect(null, actions)(CourseTeaManage);
