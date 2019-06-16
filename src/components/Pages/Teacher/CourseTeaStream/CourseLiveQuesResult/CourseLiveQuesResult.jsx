import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {Typography, Paper, TableCell, TableSortLabel, Toolbar, Tooltip, IconButton } from '@material-ui/core';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import {FilterList} from '@material-ui/icons';

class CourseLiveQuesResult extends Component {
  constructor(props){
    super(props);
    this.rows= [];
    this.id = 0;
  }

  componentWillMount(){
    this.createListResultData();
  }

  createListResultData = () => {
    const data = [
      // ['Frozen yoghurt', 159],
      // ['Ice cream sandwich', 237],
      // ['Eclair', 262],
      // ['Cupcake', 305],
      // ['Gingerbread', 356],
    ];
    // for (let i = 0; i < 200; i += 1) {
    //   const randomSelection = data[Math.floor(Math.random() * data.length)];
    //   this.rows.push(this.createResultData(...randomSelection));
    // }
    console.log(this.rows)
  }

  createResultData = (dessert, calories) => {
    this.id += 1;
    let _id = this.id
    return { _id, dessert, calories };
  }

  render() {
    console.log(this.props)
    const {recvDataResult} = this.props;
    return (
      <Paper style={{ height: 400, width: '100%' }}>
      <QuesResultToolbar/>
        <WrappedVirtualizedTable
          rowCount={recvDataResult.length}
          rowGetter={({ index }) => recvDataResult[index]}
          onRowClick={event => console.log(event)}
          columns={[
            {
              width: 200,
              flexGrow: 1.0,
              label: 'Sinh viên',
              dataKey: 'studentName',
            },
            {
              width: 150,
              label: 'Số câu hỏi',
              dataKey: 'numberQues',
              numeric: true,
            },  
            {
              width: 150,
              label: 'Số câu đúng',
              dataKey: 'correctAns',
              numeric: true,
            }
          ]}
        />
      </Paper>
    );
  }
}

class QuesResultTable extends PureComponent {
  getRowClassName = ({ index }) => {
    const { classes, rowClassName, onRowClick } = this.props;

    return classNames(classes.tableRow, classes.flexContainer, rowClassName, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex = null }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={classNames(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
    const { headerHeight, columns, classes, sort } = this.props;
    const direction = {
      [SortDirection.ASC]: 'asc',
      [SortDirection.DESC]: 'desc',
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
            height={height}
            width={width}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ cellContentRenderer = null, className, dataKey, ...other }, index) => {
              let renderer;
              if (cellContentRenderer != null) {
                renderer = cellRendererProps =>
                  this.cellRenderer({
                    cellData: cellContentRenderer(cellRendererProps),
                    columnIndex: index,
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
                      columnIndex: index,
                    })
                  }
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

const QuesResultToolbar = () => {
  return(
  <Toolbar style={styleToolbar.toolbarRoot}>
  <div style={styleToolbar.toolbarTitle}>
      <Typography variant="h6" id="tableTitle">
      Bảng kết quả của học sinh
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
  )
}

const styles = theme => ({
  table: {
    fontFamily: theme.typography.fontFamily,
    outline: 'none'
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableHeader:{
    background: '#73DB8C',
    fontWeight: 'bold',
    fontSize: '0.8em',
    color: '#ffffff'
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  }
});

const styleToolbar = {
  toolbarRoot:{
    backgroundColor: '#73DB8C'
  },
  toolbarSpacer:{
    flex: '1 1 100%'
  },
  toolbarTitle: {
    flex: '0 0 auto',
  },
}

QuesResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      cellContentRenderer: PropTypes.func,
      dataKey: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.string,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  sort: PropTypes.func,
};

QuesResultTable.defaultProps = {
  headerHeight: 56,
  rowHeight: 56,
};

const WrappedVirtualizedTable = withStyles(styles)(QuesResultTable);

export default CourseLiveQuesResult;
