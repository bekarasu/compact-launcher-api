import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Store } from 'redux'
import { IProgram } from '../../../../@types/common/program'
import { store } from '../store'
import { fetchProgram } from '../store/programs/actions'
import { IProgramImage } from '../../../../@types/common/program'
class ProgramPage extends React.Component<RouteComponentProps<RouteParams> & IProgramProps> {
  componentDidUpdate(prevProps: any) {
    if (this.props.location !== prevProps.location) {
      loadData(store, this.props.match.params)
    }
  }
  componentDidMount() {
    if (this.props.program == null) {
      loadData(store, this.props.match.params)
    }
  }
  render() {
    let images: any[] = []
    const style: React.CSSProperties = {
      marginTop: '20px',
    }
    if (typeof this.props.program != 'undefined') {
      if (typeof this.props.program.images != 'undefined') {
        // this.props.program.images.map((image: IProgramImage) => {
        // images.push({
        // original: image.path,
        // thumbnail: image.path,
        // originalAlt: this.props.program.slug,
        // thumbnailAlt: this.props.program.slug,
        // })
        // })
      }
    }
    return (
      <>
        {this.props.program == null ? (
          <p>Fetching Program...</p>
        ) : (
          <>
            <Helmet>
              <title>{this.props.program.slug}</title>
              <meta property="og:title" content="Programs" />
              {images.length > 0 ? <meta property="og:image" content={images[0].original} /> : null}
            </Helmet>
            <Row style={style}>
              <Col md="6">{images.length > 0 ? <>{/* TODO  */}</> : null}</Col>
              <Col md="6">
                <p>{this.props.program.slug}</p>
              </Col>
            </Row>
            <Row className="content ck-content ck">
              <div dangerouslySetInnerHTML={{ __html: this.props.program.content }}></div>
            </Row>
          </>
        )}
      </>
    )
  }
}
interface RouteParams {
  slug: string
}
export interface IProgramProps {
  program: IProgram
}
const mapStateToProps = (state: any) => {
  return {
    program: state.programs.program,
  }
}

async function loadData(store: Store, params: any) {
  return store.dispatch(await fetchProgram(params.slug))
}

export default {
  loadData,
  component: connect(mapStateToProps)(ProgramPage),
}
