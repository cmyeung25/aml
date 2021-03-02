var fs = require('fs-extra');
var parser = require('xml2json');
const readXlsxFile = require('read-excel-file/node');

var sourceFolder = __dirname + "\/dining_content\/source\/sc-dining-content";
var distFolder = __dirname + "\/dining_content\/dist\/sc-dining-content";
var translationSource = __dirname + "\/dining_content\/translation.xlsx";

fs.copySync(sourceFolder,distFolder)
var folderName = "\/jcr_root\/content\/am-content\/sc\/earn-partner\/dining";
var files = fs.readdirSync(distFolder + folderName);

var readingExcel = new Promise((resolve, reject) =>{
  readXlsxFile(translationSource,{ sheet: 'Comment List (SC)' }).then((rows) => {
    resolve(rows);
  });
})
var translationData = {};
var errorLog = [];

readingExcel.then((rows) => {
  for (var i = 0; i < rows.length; i++) {
    var scLink = rows[i][5];
    if(scLink != null && typeof scLink.split('/')[7] != 'undefined' && rows[i][6] != null) {
      translationData[scLink.split('/')[7]] = {
        description: rows[i][6].replace(/\r\n/g,'<br />'),
        tnc: rows[i][9] != null ? rows[i][9].replace('条款及细则\r\n','').replace('条款及细则 \r\n','').replace(/\r\n/g,'<br />') : null,
      };
    }
  }

  for (var i = 0; i < files.length; i++) {
    //brand level
    var brandKey = files[i];
    if(brandKey == '.content.xml') {
      continue;
    }

    var brandFilePath = distFolder + folderName + "\/" + brandKey + "\/.content.xml";
    var brandFile = fs.readFileSync(brandFilePath).toString();
    var brandJson = parser.toJson(brandFile);
    var brandObj = JSON.parse(brandJson);
    // die();

    var translationBrand = translationData[brandKey];

    if(typeof translationBrand != "undefined") {
      brandObj['jcr:root']['jcr:content']['par']['brands_admin']['brand-description'] = translationBrand.description;
      brandObj['jcr:root']['jcr:content']['par']['brands_admin']['terms-and-conditions-details'] = translationBrand.tnc;
    } else {
      errorLog.push("key: " + brandKey + " not found in translation");
    }

    brandJson = JSON.stringify(brandObj);

    var brandXml = parser.toXml(brandJson,{sanitize:true});
    brandXml = brandXml.replace(/&gt;/g,">");
    brandXml = brandXml.replace(/\n/g,"&#xa;");

    fs.writeFileSync(brandFilePath,brandXml);
    console.log("writing: " + brandFilePath);
  }

  console.log("There are " + errorLog.length + " error found during the execution");
  for (var i = 0; i < errorLog.length; i++) {
    console.log(errorLog[i]);
  }
  // fs.readdirSync(distFolder,(err,files) => {
  //   files.forEach(file=> {
  //     console.log(file);
  //   })
  // })
})




//
