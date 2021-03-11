import * as React from "react";
import { Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
class AboutUsPage extends React.Component {
  render() {
    return (
      <>
        <Helmet>
          <title>About Us</title>
          <meta property="og:title" content="About Us" />
        </Helmet>
        <Row>
          <strong>An API For Compact Launcher Program</strong>
        </Row>
        <Row>
          <a href="https://github.com/bkarasu95" target="_blank">
            Github Repo
          </a>
        </Row>
      </>
    );
  }
}

export default AboutUsPage;
