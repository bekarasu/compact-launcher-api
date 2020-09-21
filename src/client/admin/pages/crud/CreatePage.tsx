import { Button, FormControl } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import React from "react";
import { Helmet } from "react-helmet";
import { Field, reduxForm } from "redux-form";
import { trans } from "../../../../common/resources/lang/translate";
import { adminApiURL } from "../../../resources/strings/apiURL";
import CustomSwitch from "../../components/form/CustomSwitch";
import CustomTextInput from "../../components/form/CustomTextInput";
import ImageUploader from "../../components/form/ImageUploader";
import WYSIWYG from "../../components/form/WYSIWYG";
import ApiRequest from "../../libraries/ApiRequest";
import { ICrudPageProps } from "./types";

const CreateForm = (props) => {
  const { handleSubmit, items } = props;
  const formStyle: CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  };
  const submitStyle: React.CSSProperties = {
    marginLeft: "auto",
    marginTop: "10px",
  };
  return (
    <form className="wysiwyg-editor" style={formStyle} onSubmit={handleSubmit}>
      {items.map((item: FieldItem) => {
        switch (item.type) {
          case "text":
          case "number":
            return (
              <FormControl key={item.name}>
                <Field
                  name={item.name}
                  label={item.label}
                  component={CustomTextInput}
                />
              </FormControl>
            );
          case "wysiwyg":
            return (
              <FormControl key={item.name}>
                <Field name={item.name} component={WYSIWYG} />
              </FormControl>
            );
          case "switch":
            return (
              <FormControl key={item.name}>
                <Field
                  name={item.name}
                  label={item.label}
                  component={CustomSwitch}
                />
              </FormControl>
            );
          case "image":
            return (
              <FormControl key={item.name}>
                <Field
                  name={item.name}
                  label={item.label}
                  component={ImageUploader}
                />
              </FormControl>
            );
          default:
            return "Invalid Field Type: " + item.type;
        }
      })}
      <Button
        type="submit"
        style={submitStyle}
        variant="contained"
        color="primary"
      >
        Ürün Ekle
      </Button>
    </form>
  );
};

let CreateFormRedux: any = reduxForm({
  form: "createForm", // a unique name for the form,
})(CreateForm);

class CreatePage extends React.Component<ICreatePageProps & ICrudPageProps> {
  submit = (values: object) => {
    const requester = new ApiRequest();
    let fd = jsonToFormData(values);
    requester.post(this.props.apiURL, fd);
  };
  render() {
    return (
      <>
        <Helmet>
          <title>{trans("resource.add", { item: this.props.name })}</title>
        </Helmet>
        <CreateFormRedux onSubmit={this.submit} items={this.props.items} />
      </>
    );
  }
}

interface ICreatePageProps {
  items: Array<FieldItem>;
}

export interface FieldItem {
  label: string;
  type: string;
  name: string;
}

function buildFormData(formData, data, parentKey?) {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else {
    const value = data == null ? "" : data;

    formData.append(parentKey, value);
  }
}

function jsonToFormData(data) {
  const formData = new FormData();

  buildFormData(formData, data);

  return formData;
}

export default CreatePage;
