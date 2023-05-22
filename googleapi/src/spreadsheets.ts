import { JSONClient } from "google-auth-library/build/src/auth/googleauth";
import { google, sheets_v4 } from "googleapis";
import { Compute } from "googleapis-common";

export class spreadSheet {
  private keyFile: string;
  private spreadsheetId: string;
  private client: JSONClient | Compute;
  private auth: any;
  private googleSheets: sheets_v4.Sheets;
  constructor(
    keyFile: string,
    spreadsheetId: string,
    auth: any,
    client: JSONClient | Compute,
    googleSheets: sheets_v4.Sheets
  ) {
    this.keyFile = keyFile;
    this.spreadsheetId = spreadsheetId;
    this.auth = auth;
    this.client = client;
    this.googleSheets = googleSheets;
  }
  public static async init(keyFile: string, spreadsheetId: string) {
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({
      version: "v4",
      auth: client,
    });
    return new spreadSheet(keyFile, spreadsheetId, auth, client, googleSheets);
  }

  async read(range?: string) {
    return await this.googleSheets.spreadsheets.values.get({
      auth: this.auth,
      spreadsheetId: this.spreadsheetId,
      range,
    });
  }
  async append(range: string, data: []) {
    const prev = await this.googleSheets.spreadsheets.values.get({
      auth: this.auth,
      spreadsheetId: this.spreadsheetId,
      range
    });
    const idx = prev.data.values.length+1;
    console.log(prev);
    console.log("Siguente: ", idx);
    const max = 100;
    const min = 1;
    let values:(string[])[] = [
      [`${Math.floor(Math.random() * (max - min) + min)}`,`${Math.floor(Math.random() * (max - min) + min)}`,`=a${idx}+b${idx}`],
    ];
    const requestBody = {
      values,
    };
    return await this.googleSheets.spreadsheets.values.append({
      requestBody,
      auth: this.auth,
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
    });
  }
}

/**
 * Create a google spreadsheet
 * @param {string} title Spreadsheets title
 * @return {string} Created spreadsheets ID
 */
export async function create(title:string) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });
  const resource = {
    properties: {
      title,
    },
  };
  try {
    const spreadsheet = await service.spreadsheets.create({
      resource,
      fields: "spreadsheetId",
    });
    console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

/**
 * Gets cell values from a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The sheet range.
 * @return {obj} spreadsheet information
 */
export async function getValues(spreadsheetId:string, range:string) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });
  try {
    const result = await service.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const numRows = result.data.values ? result.data.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
    return result;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

/**
 * Batch gets cell values from a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} _ranges The mock sheet range.
 * @return {obj} spreadsheet information
 */
export async function batchGetValues(spreadsheetId:string, _ranges:string) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });
  let ranges:string[] = [
    // Range names ...
  ];
  try {
    const result = await service.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
    });
    console.log(`${result.data.valueRanges.length} ranges retrieved.`);
    return result;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

/**
 * Updates values in a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The range of values to update.
 * @param {object} valueInputOption Value update options.
 * @param {(string[])[]} _values A 2d array of values to update.
 * @return {obj} spreadsheet information
 */
export async function updateValues(
  spreadsheetId:string,
  range:string,
  valueInputOption:object,
  _values:(string[])[]
) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });
  let values:(string[])[] = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  const resource = {
    values,
  };
  try {
    const result = await service.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log("%d cells updated.", result.data.updatedCells);
    return result;
  } catch (err) {
    // TODO (Developer) - Handle exception
    throw err;
  }
}

/**
 * Batch Updates values in a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The range of values to update.
 * @param {object} valueInputOption Value update options.
 * @param {(string[])[]} _values A 2d array of values to update.
 * @return {obj} spreadsheet information
 */
export async function batchUpdateValues(
  spreadsheetId:string,
  range:string,
  valueInputOption:object,
  _values:(string[])[]
) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });
  let values:(string[])[] = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  const data = [
    {
      range,
      values,
    },
  ];
  // Additional ranges to update ...
  const resource = {
    data,
    valueInputOption,
  };
  try {
    const result = await service.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource,
    });
    console.log("%d cells updated.", result.data.totalUpdatedCells);
    return result;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

/**
 * Appends values in a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The range of values to append.
 * @param {object} valueInputOption Value input options.
 * @param {(string[])[]} _values A 2d array of values to append.
 * @return {obj} spreadsheet information
 */
export async function appendValues(
  spreadsheetId:string,
  range:string,
  valueInputOption:object,
  _values:(string[])[]
) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });
  let values:(string[])[] = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  const resource = {
    values,
  };
  try {
    const result = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log(`${result.data.updates.updatedCells} cells appended.`);
    return result;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}
