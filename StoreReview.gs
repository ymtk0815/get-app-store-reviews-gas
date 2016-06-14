function appStore() {

  var columnNum = 6;
  var active = SpreadsheetApp.getActive();
  var appStoreSheet = active.getSheetByName('AppStore');
  var currentSheetData = appStoreSheet.getRange(2, 1, appStoreSheet.getMaxRows() - 1, columnNum).getValues();
  var currentLastId = currentSheetData[0][0];

  // feedURL
  var feedURL = "https://itunes.apple.com/jp/rss/customerreviews/id=507874739/sortBy=mostRecent/json";
  var response = UrlFetchApp.fetch(feedURL);
  var reviewJson = JSON.parse(response.getContentText());
  var entries = reviewJson["feed"]["entry"];
  var reviewDataList = [];

  // entries[0]は要らない
  for (var i = 1; i < entries.length; i++) {
    var reviewData = [];
//    reviewData[0] = entries[i]["author"]["uri"]["label"].replace( /https:\/\/itunes.apple.com\/jp\/reviews\/id/g , "" );
    reviewData[0] = entries[i]["id"]["label"];
    reviewData[1] = entries[i]["author"]["name"]["label"];
    reviewData[2] = entries[i]["im:version"]["label"];
    reviewData[3] = entries[i]["im:rating"]["label"];
    reviewData[4] = entries[i]["title"]["label"];
    reviewData[5] = entries[i]["content"]["label"];

    if (currentLastId == reviewData[0]) {
      Logger.log("end");
      break;
    }

    reviewDataList.push(reviewData);
  }

  for (var j = 0; j < currentSheetData.length; j++) {
    if (currentSheetData[j][0] == null || currentSheetData[j][0] == "") {
      break;
    }
    reviewDataList.push(currentSheetData[j]);
  }

  appStoreSheet.getRange(2, 1, reviewDataList.length, columnNum).setValues(reviewDataList);

}
