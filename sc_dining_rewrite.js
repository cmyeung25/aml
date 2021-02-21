var fs = require('fs-extra');
var parser = require('xml2json');
const readXlsxFile = require('read-excel-file/node');

var sourceFolder = __dirname + "\\dining_content\\source\\dining_site_content_repack";
var distFolder = __dirname + "\\dining_content\\dist\\dining_site_content_repack";
var translationSource = __dirname + "\\dining_content\\translation.xlsx";

fs.copySync(sourceFolder,distFolder)
var folderName = "\\jcr_root\\content\\am-content\\sc\\earn-partner\\dining";
var files = fs.readdirSync(distFolder + folderName);

var readingExcel = new Promise((resolve, reject) =>{
  readXlsxFile(translationSource,{ sheet: 'Comment List (SC)' }).then((rows) => {
    resolve(rows);
  });
})
var translationData = {};

readingExcel.then((rows) => {
  for (var i = 0; i < rows.length; i++) {
    var scLink = rows[i][5];
    if(scLink != null && typeof scLink.split('/')[7] != 'undefined') {
      translationData[scLink.split('/')[7]] = {
        description: rows[i][6],
      };
    }
  }

  console.log(translationData);

  for (var i = 0; i < files.length; i++) {
    //brand level
    var brandKey = files[i];
    if(brandKey == '.content.xml') {
      continue;
    }

    var brandFilePath = distFolder + folderName + "\\" + brandKey + "\\.content.xml";
    var brandFile = fs.readFileSync(brandFilePath).toString();
    var brandJson = parser.toJson(brandFile);
    die();
    console.log(brandJson);
    // die()
  }
  // fs.readdirSync(distFolder,(err,files) => {
  //   files.forEach(file=> {
  //     console.log(file);
  //   })
  // })
})




//
