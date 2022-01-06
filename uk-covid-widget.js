// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: user-md;

/*

 Usage:

   This script is designed to be run as a Small widget within Scriptable
   (https://scriptable.app).

   To configure:

   - Create a new Small Scriptable widget on your iOS device
   - Tap and hold on the widget and choose Edit Widget
   - In the Parameter, enter one of the values "uk", "england", "scotland", "wales" or "northern ireland"

 */
   function createWidget(data, widgetConfig) {
    let dose1Change = 0;
    let dose1Total = "";
    let dose2Change = 0;
    let dose2Total = "";
    let dose3Change = 0;
    let dose3Total = "";
     if (widgetConfig.areaType === "msoa") {
      dose1Total = data[0].cumPeopleVaccinatedFirstDoseByVaccinationDate;
      dose2Total = data[0].cumPeopleVaccinatedSecondDoseByVaccinationDate;
      dose3Total = data[0].cumPeopleVaccinatedThirdInjectionByVaccinationDate;
      if (data.length > 1) {
        dose1Change = data[0].cumPeopleVaccinatedFirstDoseByVaccinationDate - data[1].cumPeopleVaccinatedFirstDoseByVaccinationDate;
        dose2Change = data[0].cumPeopleVaccinatedSecondDoseByVaccinationDate - data[1].cumPeopleVaccinatedSecondDoseByVaccinationDate;
        dose3Change = data[0].cumPeopleVaccinatedThirdInjectionByVaccinationDate - data[1].cumPeopleVaccinatedThirdInjectionByVaccinationDate;
      }
    } else {
      dose1Change = data[0].cumPeopleVaccinatedFirstDoseByPublishDate - data[1].cumPeopleVaccinatedFirstDoseByPublishDate;
      dose1Total = data[0].cumPeopleVaccinatedFirstDoseByPublishDate;
      dose2Change = data[0].cumPeopleVaccinatedSecondDoseByPublishDate - data[1].cumPeopleVaccinatedSecondDoseByPublishDate;
      dose2Total = data[0].cumPeopleVaccinatedSecondDoseByPublishDate;
      dose3Change = data[0].cumPeopleVaccinatedThirdInjectionByPublishDate - data[1].cumPeopleVaccinatedThirdInjectionByPublishDate;
      dose3Total = data[0].cumPeopleVaccinatedThirdInjectionByPublishDate;
  
    }
    let statsDate = data[0].date;
  
    let widget = new ListWidget();
  
    let title = widget.addText("💉" + data[0].areaName);
    title.font = Font.boldSystemFont(16);
    title.minimumScaleFactor = 0.6;
    title.lineLimit = 2;
  
    let subTitle = widget.addText(statsDate);
    subTitle.font = Font.regularSystemFont(12);
    subTitle.textColor = Color.gray();
  
    widget.addSpacer();
  
    let dose1 = getDoseStack(widget, dose1Total, dose1Change, 1, Color.green());
    let dose2 = getDoseStack(widget, dose2Total, dose2Change, 2, Color.cyan());
    let dose3 = getDoseStack(widget, dose3Total, dose3Change, 3, Color.orange());
    
    widget.addSpacer();
  
  
    return widget;
  }
  
  function getDeltaString(delta) {
    let deltaText = "";
    if (delta > 0) {
      deltaText = " ⬆︎ " + delta.toLocaleString("en-GB"); 
    } else {
      deltaText = " ⬌ ";
    }
    return deltaText
  }
  
  function getDoseText(widget, total, delta) {
    let deltaText = getDeltaString(delta);
  
    let doseText = widget.addText(total.toLocaleString("en-GB") + " (" + deltaText + ")");
    doseText.font = Font.regularSystemFont(20);
    doseText.leftAlignText();
    return doseText;
  }
  
  function getDoseStack(widget, total, delta, num, colour) {
    let doseStack = widget.addStack();
    doseStack.bottomAlignContent();
    
    let labelText = doseStack.addText(num.toLocaleString("en-GB") + " ");
    labelText.font = Font.regularSystemFont(10);
    
    let doseText = doseStack.addText(total.toLocaleString("en-GB"));
    doseText.font = Font.regularSystemFont(20);
    doseText.textColor = colour;
    doseText.leftAlignText();
    doseText.minimumScaleFactor = 0.4
    doseText.lineLimit = 1;
    
    doseStack.addSpacer()
    
    let deltaText = doseStack.addText(getDeltaString(delta));
    deltaText.font = Font.regularSystemFont(10);
    deltaText.leftAlignText();
    
    return doseStack;
   }
  
  function copyIfNotNull(to, from, prop) {
    let fromProp = from[prop];
    if (fromProp != null) {
      to[prop] = fromProp;
    }
  }
  
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, "\\$&");
    console.log(url);
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return "";
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  
  function getConfig(widgetParameter) {
    // widgetParameter can either be a json object with `areaType` and `areaName`,
    // or it can be the URL from https://coronavirus.data.gov.uk/details/download
    let widgetConfig = {
      areaType: "",
      areaName: "",
    };
    if (widgetParameter === "" || widgetParameter.toLowerCase() === "overview" || widgetParameter.toLowerCase() === "uk") {
      widgetConfig["areaType"] = "overview";
      widgetConfig["areaCode"] = "";
    } else if (widgetParameter[0] === "{") {
      areaParams = JSON.parse(widgetParameter);
      copyIfNotNull(widgetConfig, areaParams, "areaType");
      copyIfNotNull(widgetConfig, areaParams, "areaCode");
    } else {
      widgetConfig.areaType = getParameterByName("areaType", widgetParameter);
      widgetConfig.areaCode = getParameterByName("areaCode", widgetParameter);
    }
    return widgetConfig;
  }
  
  async function getData(config) {
    let areaType = config.areaType;
    let areaCode = config.areaCode;
    let dateSpec = config.areaType === "msoa" ? "Vaccination" : "Publish";
    let req = new Request(
      `https://api.coronavirus.data.gov.uk/v2/data?areaType=${areaType}&areaCode=${areaCode}` +
      `&metric=cumPeopleVaccinatedFirstDoseBy${dateSpec}Date` +
      `&metric=cumPeopleVaccinatedSecondDoseBy${dateSpec}Date` +
      `&metric=cumPeopleVaccinatedThirdInjectionBy${dateSpec}Date` +
      "&format=json"
    );
//    console.log(req.url);
    let response = await req.loadString();
//    console.log(response);
    return JSON.parse(response).body;
  }
  
  if (config.runsInApp) {
    // Demo for in-app testing
    let widgetConfig = getConfig('{"areaType": "msoa", "areaCode": "E02003376"}');
//    let widgetConfig = getConfig('{"areaType": "overview", "areaCode": ""}');
    let data = await getData(widgetConfig);
    let widget = createWidget(data, widgetConfig);
    widget.presentSmall();
  } else {
    // The real deal
    let widgetConfig = getConfig(args.widgetParameter);
    let data = await getData(widgetConfig);
    let widget = createWidget(data, widgetConfig);
    Script.setWidget(widget);
  }
  