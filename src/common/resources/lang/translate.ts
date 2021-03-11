import app from "../../config/app.json";
import { localeTR } from "./tr";
import { localeEN } from "./en";
import { LanguageGroup, TranslateParams } from "../../../../@types/common/lang";

// define your valid languages in there
let locale: LanguageGroup = {
  tr: localeTR,
  en: localeEN,
};

// translate the text with variable, it is useful when dynamic parameters required
export const trans = (key: string, params?: TranslateParams, lang?: string): string => {
  if (lang == null) lang = app.lang; // if lang is not set, get the default lang in config
  let text: string = index(locale[lang], key);
  if (text == null || text === "") return key; 
  for (const param in params) {
    text = text.replace(":" + param, trans(params[param]));
  }
  return text;
};
// get the value in object that given string key notating via dot
export const index = (obj: any, key: string | string[]): string => {
  try {
    if (typeof key == "string") return index(obj, key.split("."));
    // we access the key via '.' , so split '.'
    else if (key.length == 0) return obj;
    else return index(obj[key[0]], key.slice(1));
  } catch (e) {
    console.log("translation not found");
    return "";
  }
};
