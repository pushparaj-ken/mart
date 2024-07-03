const excel = require("exceljs");
var fs = require('fs');
var path = require('path');
var Formatter = require('../services/formatter');

var ExportCommonExcel = async (data, filename) => {
  let data1 = []
  for (each in data) {
    let entries = Object.entries(data[each])
    let data12 = entries.map(([key, val] = entry) => {
      return { header: Formatter.capitalize(key), key: key, width: 25 }
    });
    data1.push(data12)
  }
  try {

    const ALL_VENDORS_REPORT_FILES_PATH = path.resolve('public', 'export', filename);
    if (!fs.existsSync(ALL_VENDORS_REPORT_FILES_PATH)) {
      fs.mkdirSync(ALL_VENDORS_REPORT_FILES_PATH, { recursive: true });
    }
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet(filename);
    let columns = [];
    for (record in data1) {
      columns.push(data1[record]);
    }
    //console.log(columns[0]);
    worksheet.columns = columns[0]
    worksheet.addRows(data);
    worksheet.getRow(1).font = {
      bold: true
    }
    let date = new Date();
    let DD = date.getDate();
    if (DD < 10) {
      DD = "0" + DD;
    }
    let MM = date.getMonth() + 1;
    if (MM < 10) {
      MM = "0" + MM;
    }
    let YY = date.getFullYear();
    let getTime = date.getTime();
    let filedate = "-" + DD.toString() + "-" + MM.toString() + "-" + YY.toString() + "-" + getTime;
    let fileName = `${filename}${filedate}.xlsx`;
    //console.log(fileName);
    await workbook.xlsx.writeFile(path.resolve(ALL_VENDORS_REPORT_FILES_PATH, fileName));
    return `export/${filename}/${fileName}`;
  } catch (err) {
    console.log('Error while generating Sales Summary Report', err);
  }

}

module.exports = {
  ExportCommonExcel,
}