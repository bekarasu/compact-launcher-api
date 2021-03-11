import * as React from "react"; // we should import this for avoiding " React refers to a UMD global but the current file is a module. Consider adding an import instead" error
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "../../client/app/App";
import { Store } from "redux";
import serialize from "serialize-javascript";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";
import "./string";

export default (url: string, store: Store): string => {
  const app = renderToString(
    <Provider store={store}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </Provider>
  );
  const helmet = Helmet.renderStatic();
  const html = `
    <html>
        <head>
          <link rel="stylesheet" href="/assets/css/app.css">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
        </head>
        <body>
            <div id="app">${app}</div>
            <script>
              window.INITIAL_STATE = ${serialize(store.getState())}
            </script>
            <script src="/app.js"></script>
        </body>
    </html>
  `.replace(/\r?\n|\r|\n/g,'').replaceAll("  ", "");  
  return html;
};
