import { Paper, Snackbar, Table, TableContainer } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import { connect } from "react-redux";
import { IDataTableProps, IDataTableState } from "../../../../@types/client/admin/components";
import { IFilter } from "../../../../@types/client/admin/form";
import ApiRequest from "../libraries/ApiRequest";
import DataTableBody from "./DataTable/DataTableBody";
import DataTableFooter from './DataTable/DataTableFooter';
import DataTableHead from "./DataTable/DataTableHead";
import Filter from "./Filter";

class DataTable extends React.Component<IDataTableProps, IDataTableState>{
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      fetching: true, // data fetching state from server
      requestParams: { // request to server params
        limit: 30, // data limit
        start: 0, // data skip
        orderBy: null // data order by
      },
      dataCount: null, // total data from server (not only limitted data count)
      deleteResult: null, // data delete result
      currentPage: 1
    };
  }
  actionResult(result: boolean): void {
    this.getData();
    this.setState({ deleteResult: result ? "success" : "error" });
  }
  componentDidMount() {
    this.getData();
  }
  handlePageChange = (page: number) => { // handle the page change, it is getting from footer.
    let newParams = this.state.requestParams;
    newParams.start = (page - 1) * this.state.requestParams.limit; // you should use page - 1 for better accurate
    this.setState({ requestParams: newParams, currentPage: page })
    this.getData();
  }
  handleDataLengthChange = (length: number) => { // handle the page change, it is getting from footer.
    let newParams = this.state.requestParams;
    newParams.limit = length;
    this.setState({ requestParams: newParams })
    this.getData();
  }

  componentDidUpdate(prevProps: IDataTableProps) {
    if (prevProps.resourceURL !== this.props.resourceURL || prevProps.filters.fields !== this.props.filters.fields) { // check these for preventing unnecessary data getting
      if (this.props.filters.fields !== null) {
        let newParams = this.state.requestParams;
        newParams.start = 0; // if the filter is set, reset the page state 
        this.setState({ requestParams: newParams, currentPage: 1 });
        let search = ""; // request search param
        this.props.filters.fields.map((filter: IFilter, index: number) => {  // convert the server compatible query
          search += filter.name + "=" + filter.value;
          if (this.props.filters.fields.length !== 1 && index < this.props.filters.fields.length - 1) {
            search += ","; // seperate the fields
          }
        })
        let newRequestParams = this.state.requestParams;
        newRequestParams.search = search;
        this.setState({ requestParams: newRequestParams, items: [] })
      }
      this.getData();
    }
  }

  getData() {
    this.setState({ fetching: true });
    window.scrollTo(0, 0);
    const requester = new ApiRequest();
    requester.get(this.props.resourceURL, this.state.requestParams).then((res: any) => {
      this.setState({ items: res.data.data.items, dataCount: res.data.data.total, fetching: false });
    });
  }
  render() {
    return (
      <>
        {typeof this.props.filterFields !== "undefined" && this.props.filterFields.length !== 0 && (<Filter items={this.props.filterFields} />)}
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <DataTableHead fetching={this.state.fetching} {...this.props} items={this.state.items} />
            <DataTableBody fetching={this.state.fetching} items={this.state.items} {...this.props} actionResult={this.actionResult.bind(this)} />
            <DataTableFooter currentPage={this.state.currentPage} dataLengthChange={this.handleDataLengthChange} pageChange={this.handlePageChange} fetching={this.state.fetching} dataCount={this.state.dataCount} {...this.props} limit={this.state.requestParams.limit} />
          </Table>
        </TableContainer>
        {/** TODO make it app-wide snackbar */}
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={this.state.deleteResult != null} autoHideDuration={5000} onClose={() => { this.setState({ deleteResult: null }) }}>
          <Alert severity={"success"}>Record Deleted</Alert>
        </Snackbar>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    filters: state.filters
  };
};

export default connect(mapStateToProps)(DataTable);