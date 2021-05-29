import * as React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Store } from "redux";
import { IProgram } from "../../../../@types/common/program";
import { trans } from "../../../common/resources/lang/translate";
import { fetchPrograms } from "../store/programs/actions";
import { store } from "../store";

class HomePage extends React.Component<RouteComponentProps<RouteParams> & IProgramsProps> {
  componentDidMount() {
    if (this.props.programs == null) {
      loadData(store);
    }
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Anasayfa</title>
          <meta property="og:title" content="Anasayfa" />
        </Helmet>
        {this.props.programs != null && this.props.programs.total > 0 ? (
          this.props.programs.items.map((program: IProgram, key: number) => (
            <p key={key}>{program.name}</p>
          ))
        ) : (
          <p>{trans("general.not_found", { item: "Program" })}</p>
        )}
      </>
    );
  }
}

interface RouteParams {
  slug: string;
}
interface IProgramsProps {
  programs?: { items: Array<IProgram>, total: number };
}

const mapStateToProps = (state: any) => {
  return {
    programs: state.programs.programs,
  };
};

async function loadData(store: Store) {
  return store.dispatch(await fetchPrograms());
}

export default {
  loadData,
  component: connect(mapStateToProps)(HomePage),
};
