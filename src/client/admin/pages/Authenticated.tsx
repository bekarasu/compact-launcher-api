import { CssBaseline, Grid } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { connect } from "react-redux";
import { RouteConfigComponentProps } from "react-router-config";
import { withRouter } from "react-router-dom";
import { store } from "..";
import { APP_NAME } from "../../resources/strings/app";
import Content from "../layouts/Content";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";
import { clearResult } from "../store/result/actions";
import { IAuthenticatedPageProps } from './../../../../@types/client/admin/pages.d';
import { setTheme } from './../store/theme/actions';
class Authenticated extends React.Component<RouteConfigComponentProps<{}> & IAuthenticatedPageProps> {
  componentDidMount() {
    store.dispatch(setTheme(localStorage.getItem("admin:theme") === "dark" ? "dark" : "light"))
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      if (this.props.result.showed) {
        store.dispatch(clearResult()) // remove the ResultMessageBox
      }
    }
  }
  render() {
    const navbarStyle: React.CSSProperties = {
      float: "right",
      padding: "20px 10px"
    };
    return (
      typeof this.props.theme.palette !== "undefined" &&
      <ThemeProvider theme={this.props.theme}>
        <CssBaseline />
        <Grid container direction="row">
          <Grid item md={2}>
            <Sidebar />
          </Grid>
          <Grid item md={10} className="min-vh-100 main-container">
            <Navbar style={navbarStyle} />
            <Grid container item direction="column">
              <p>{APP_NAME}</p>
              <Content />
            </Grid>
            <Footer />
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    result: state.result,
    theme: state.theme
  };
};

export default connect(mapStateToProps)(withRouter(Authenticated));