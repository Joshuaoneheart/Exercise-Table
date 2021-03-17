//處理外部傳來的get request (在網址後加上?[key]=[value])
function doGet(e){
  var para = e.parameter;
  Logger.log(e)
  Logger.log(para.function);
  //根據function的value提供不同的網站服務
  if(para.function == "test"){
    return HtmlService.createHtmlOutputFromFile('notification.html');
  }
  else if(para.function == "registration"){
    return HtmlService.createHtmlOutputFromFile('Token.html');
  }
  if(para.page == "notification"){
  return HtmlService.createHtmlOutputFromFile('notification.html');
  }
  else if(para.page == "index"){
    return HtmlService.createHtmlOutputFromFile('index.html').setTitle("台大台科大操練表系統");
  }
}

function get_page(page_name) {
  Logger.log(HtmlService.createHtmlOutputFromFile(page_name + ".html").getContent());
  return HtmlService.createHtmlOutputFromFile(page_name + ".html").getContent();
}
