import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import App from "../../../../../client/app/App";

class HomeController {
  index = async (req: Request, res: Response) => {
    const app = renderToString(React.createElement(App));
    const indexFile = path.resolve(path.join(__dirname, "../src/server/resources/views/react-app.html"));
    fs.readFile(indexFile, "utf8", (err, data) => {
      if (err) {
        console.error("Something went wrong:", err);
        // TODO change response
        return res.status(500).send("Oops, better luck next time!");
      }
      return res.send(data.replace('<div id="app"></div>', `<div id="app">${app}</div>`));
    });
  };
}
export default new HomeController();
