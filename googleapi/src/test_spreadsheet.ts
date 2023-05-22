import { google } from "googleapis";

export const testGoogle = async (
  keyFile: string,
  spreadsheetId: string,
  range: string
) => {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });
  console.log(metaData);
  const rows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  });
  console.log(rows);
};

export const sheetAuth = async (
  keyFile: string,
) => {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });
  return {auth, client, googleSheets }
}