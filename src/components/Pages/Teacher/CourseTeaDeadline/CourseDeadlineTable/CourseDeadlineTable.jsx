import React, { Component, PureComponent } from 'react';
import './CourseDeadlineTable.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Paper, TableCell, TableSortLabel, Toolbar, Tooltip, IconButton, Popover } from '@material-ui/core';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import { FilterList, Delete, Edit, Visibility, Assignment } from '@material-ui/icons';

import docIco from '../../../../../assets/images/ico/doc-ico.svg';

class CourseDeadlineTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deadlineSel: {}
		};
		this.rows = [];
		this.id = 0;
		this.typeAction = null;
	}

	componentWillMount() {
		this.createListDeadlineData();
	}

	createListDeadlineData = () => {
		let deadlineList = [];
		let deadlineListTemp = [];
		deadlineListTemp = this.props.deadlineList;
		deadlineListTemp.forEach((data, index) => {
			const EndDateCvt = data.EndDate.replace('T', ' ');
			const CreateDateCvt = data.CreateDate.replace('T', ' ');
			let dataTemp = {
				deadlineId: data.Id,
				deadlineTitle: data.Title,
				deadlineFile: data.ThreadsFile,
				deadlineDescr: data.Threads,
				createDate: CreateDateCvt,
				finishDate: EndDateCvt
			};
			deadlineList.push(dataTemp);
		});
		this.rows = deadlineList;
	};

	handleChooseDeadline = (e) => {
		e.event.preventDefault();
		if (this.typeAction !== null && this.typeAction !== undefined) {
			if (this.typeAction === 2){
				const deadlineId = e.rowData.deadlineId;
				this.props.openSubmitPopup(deadlineId);
			} else if (this.typeAction === 1) {
				const deadlineId = e.rowData.deadlineId;
				this.props.openDelPopup(deadlineId);
			} else if (this.typeAction === 0) {
				const deadlineData = e.rowData;
				this.props.openUpdatePopup(deadlineData);
			}
			this.typeAction = null;
		}
	};

	handleOpenDelPopup = () => {
		this.typeAction = 1;
	};

	handleOpenUpdatePopup = () => {
		this.typeAction = 0;
	};

	handleOpenSubmitPopup = () => {
		this.typeAction = 2;
	};

	render() {
		const rows = this.rows;
		return (
			<Paper style={{ height: 450, width: '100%' }}>
				<DeadlineToolbar />
				<div style={{ width: '100%', height: '100%' }}>
					<WrappedVirtualizedTable
						openDelPopup={this.handleOpenDelPopup}
						openUpdatePopup={this.handleOpenUpdatePopup}
						openSubmitPopup={this.handleOpenSubmitPopup}
						rowCount={rows.length}
						rowGetter={({ index }) => rows[index]}
						onRowClick={this.handleChooseDeadline}
						columns={[
							{
								width: 200,
								flexGrow: 1.0,
								label: 'Bài tập',
								dataKey: 'deadlineTitle'
							},
							{
								width: 100,
								flexGrow: 1.0,
								label: 'Mô tả',
								dataKey: 'deadlineDescr'
							},
							{
								width: 150,
								label: 'Ngày khởi tạo',
								dataKey: 'createDate',
								numeric: true
							},
							{
								width: 150,
								label: 'Ngày kết thúc',
								dataKey: 'finishDate',
								numeric: true
							},
							{
								width: 170,
								label: '',
								dataKey: 'action',
								numeric: true
							}
						]}
					/>
				</div>
			</Paper>
		);
	}
}

class DeadlineTable extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
			deadlineDetail: ''
		};
	}

	handlePopoverDescrOpen = (event, detail) => {
		this.setState({ anchorEl: event.currentTarget, deadlineDetail: detail });
	};

	handlePopoverDescrClose = () => {
		this.setState({ anchorEl: null });
	};

	handleOpenDelPopup = () => {
		this.props.openDelPopup();
	};

	handleOpenUpdatePopup = () => {
		this.props.openUpdatePopup();
	}

	handleOpenSubmitPopup = () => {
		this.props.openSubmitPopup();
	}
	getsubmitbyexerciseid

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
		const { columns, classes, rowHeight, onRowClick } = this.props;
		const { anchorEl } = this.state;
		const openPopper = Boolean(anchorEl);
		return (
			<TableCell
				component="div"
				className={classNames(classes.tableCell, classes.flexContainer, classes.tableCustom, {
					[classes.noClick]: onRowClick == null
				})}
				variant="body"
				style={{ height: rowHeight }}
				align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
			>
				{columnIndex === 0 && (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<img style={{ width: '35px', height: '35px', margin: '0 0.5em' }} src={docIco} alt="" />
						{cellData}
					</div>
				)}
				{columnIndex !== 0 && columnIndex !== 4 && columnIndex !== 1 && cellData}
				{columnIndex === 1 && (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<IconButton
							aria-label="Detail"
							aria-owns={openPopper ? 'mouse-over-popover' : undefined}
							aria-haspopup="true"
							onClick={(e, _cellData = cellData) => this.handlePopoverDescrOpen(e, _cellData)}
						>
							<Visibility />
						</IconButton>
						<Popover
							id="mouse-over-popover"
							PaperProps={{ elevation: 1 }}
							open={openPopper}
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left'
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left'
							}}
							onClose={this.handlePopoverDescrClose}
						>
							<div className="description-popever">
								<Typography variant="h6">Chi tiết bài tập</Typography>
								<Typography variant="subtitle2">{this.state.deadlineDetail}</Typography>
							</div>
						</Popover>
					</div>
				)}
				{columnIndex === 4 && (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Tooltip title="Xoá">
							<IconButton style={{padding: '8px'}} aria-label="Xóa" onClick={this.handleOpenDelPopup}>
								<Delete />
							</IconButton>
						</Tooltip>
						<Tooltip title="Chỉnh sửa">
							<IconButton style={{padding: '8px'}} aria-label="Edit" onClick={this.handleOpenUpdatePopup}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip style={{padding: '8px'}} title="Xem bài nộp">
							<IconButton aria-label="Submit" onClick={this.handleOpenSubmitPopup}>
								<Assignment />
							</IconButton>
						</Tooltip>
					</div>
				)}
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
				align={columns[columnIndex].numeric || false ? 'right' : 'left'}
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

const DeadlineToolbar = () => {
	return (
		<Toolbar style={styleToolbar.toolbarRoot}>
			<div style={styleToolbar.toolbarTitle}>
				<Typography variant="h6" id="tableTitle">
					Danh sách bài tập
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
		flex: 1
	},
	tableCustom: {
		outline: 'none'
	},
	noClick: {
		cursor: 'initial'
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

DeadlineTable.propTypes = {
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

DeadlineTable.defaultProps = {
	headerHeight: 56,
	rowHeight: 56
};

const WrappedVirtualizedTable = withStyles(styles)(DeadlineTable);

export default CourseDeadlineTable;
