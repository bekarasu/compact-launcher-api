import { Button } from '@material-ui/core'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { reduxForm } from 'redux-form'
import { IUpdatePageProps, IUpdatePageState } from '../../../../@types/client/admin/pages'
import { trans } from '../../../common/resources/lang/translate'
import { jsonToFormData } from '../../resources/helpers/form'
import CustomForm from '../components/form/CustomForm'
import ApiRequest from '../libraries/ApiRequest'
import { showServerResult } from '../store/result/actions'
import { store } from '..';

class UpdateFormFooter extends React.Component {
  render() {
    const submitStyle: React.CSSProperties = {
      marginLeft: 'auto',
      marginTop: '10px',
    }
    return (
      <>
        <Button type="submit" style={submitStyle} variant="contained" color="primary">
          {trans('resource.update')}
        </Button>
      </>
    )
  }
}

const UpdateForm = (props) => {
  const { handleSubmit, items } = props
  return <CustomForm footerComponent={<UpdateFormFooter />} handleSubmit={handleSubmit} items={items} />
}

let UpdateFormRedux: any = reduxForm({
  form: 'updateForm',
})(UpdateForm)

class UpdatePage extends React.Component<IUpdatePageProps & RouteComponentProps<RouteParams>, IUpdatePageState> {
  constructor(props) {
    super(props)
    this.state = {
      fetching: true,
      items: this.props.items,
      redirectURL: null,
    }
  }
  componentDidMount() {
    const requester = new ApiRequest()
    requester.get(this.props.serverResource + '/' + this.props.match.params.id + '/edit').then((res: any) => {
      const data = res.data.data
      this.setState({ fetching: false, ...data })
    })
  }
  submit(values: object) {
    const requester = new ApiRequest()
    let fd = jsonToFormData(values)
    requester.put(this.state.resource + '/' + this.props.match.params.id, fd).then((res) => {
      if (res.status === 200) {
        store.dispatch(showServerResult('success', res.data.message));
        this.setState({ redirectURL: res.data.data.redirectUrl }) // redirect if the request is success
      } else if (res.status >= 400 && res.status <= 499) {
        store.dispatch(showServerResult('warning', res.data.message));
      } else if (res.status >= 500) {
        store.dispatch(showServerResult('error', res.data.message));
      }
    })
  }
  render() {
    return (
      <>
        {this.state.redirectURL ? (
          <Redirect to={this.state.redirectURL} />
        ) : (
          <>
            <Helmet>
              <title>{trans('resource.update', { item: this.state.title })}</title>
            </Helmet>
            {this.state.fetching ? <p>Yükleniyor... </p> : <UpdateFormRedux onSubmit={this.submit.bind(this)} items={this.state.items} />}
          </>
        )}
      </>
    )
  }
}

interface RouteParams {
  id: string
}

export default UpdatePage
