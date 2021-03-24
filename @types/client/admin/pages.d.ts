import { FieldItem, FilterField, IListActions } from "./form";
import { Message } from "./redux";
import { IPanelUser } from './user.d';

export interface ILoginPageProps { }


export interface IReduxUserProps {
  user: IPanelUser
}
export interface ILoginPageState {
  username: string;
  password: string;
}

export interface IAuthenticatedPageProps {
  result: Message | null
  theme: any
}

export interface ICrudPageProps {
  serverResource: string
}


export interface ICrudPageState { // TODO these will be must
  title?: string | null;
  resource?: string | null;
  fetching: boolean
}


interface ICreatePageProps extends ICrudPageProps {

}

interface ICreatePageState extends ICrudPageState {
  redirectURL: string | null // TODO add this to app-wide system
  items: Array<FieldItem>; // form input fields
}

interface IUpdatePageProps extends ICrudPageProps {
  items: Array<FieldItem>; // form input fields
  id: string; // id of resource
  resource: string
}

interface IUpdatePageState extends ICrudPageState {
  items: Array<FieldItem>; // we will modify this object for setting initial input values. so pass items props to state
  redirectURL: string | null // TODO add this to app-wide system
  fetching: boolean;
}

interface IListPageProps extends ICrudPageProps {
}

export interface IListPageState extends ICrudPageState {
  fields: Array<string>; // for showing data fields
  actions: IListActions;
  disableAdd?: boolean; // disables the Add button in list
  filterItems?: Array<FilterField>
}

export interface IResourceRouteProps {
  resource: string
}