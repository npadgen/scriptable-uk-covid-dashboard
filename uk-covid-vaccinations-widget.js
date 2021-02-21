// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: user-md;
function createWidget(data) {
  let dose1Change = data[0].newPeopleVaccinatedFirstDoseByPublishDate;
  let dose1Total = data[0].cumPeopleVaccinatedFirstDoseByPublishDate;
  let dose2Change = data[0].newPeopleVaccinatedSecondDoseByPublishDate;
  let dose2Total = data[0].cumPeopleVaccinatedSecondDoseByPublishDate;
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

  let dose1 = widget.addText(dose1Total.toLocaleString("en-GB"));
  dose1.font = Font.regularSystemFont(20);
  dose1.leftAlignText();
  dose1.textColor = Color.green();

  let dose1Delta = "";
  if (dose1Change > 0) {
    dose1Delta = " ⬆︎ " + dose1Change.toLocaleString("en-GB"); 
  } else {
    dose1Delta = " ⬌ (unchanged)";
  }
  let dose1DeltaText = widget.addText(dose1Delta);
  dose1DeltaText.font = Font.regularSystemFont(10);
  dose1DeltaText.leftAlignText();
  dose1DeltaText.textColour = Color.green();

  let dose2 = widget.addText(dose2Total.toLocaleString("en-GB"));
  dose2.font = Font.regularSystemFont(20);
  dose2.centerAlignText;
  dose2.textColor = Color.cyan();

  let dose2Delta = "";
  if (dose2Change > 0) {
    dose2Delta = " ⬆︎ " + dose2Change.toLocaleString("en-GB"); 
  } else {
    dose2Delta = " ⬌ (unchanged)";
  }
  let dose2DeltaText = widget.addText(dose2Delta);
  dose2DeltaText.font = Font.regularSystemFont(10);
  dose2DeltaText.leftAlignText();
  dose2DeltaText.textColour = Color.cyan();

  widget.addSpacer();


  return widget;
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
  } else {
    widgetConfig["areaType"] = "nation";
    widgetConfig["areaName"] = widgetParameter;
  }
  return widgetConfig;
}

async function getData(config) {
  let areaType = config.areaType;
  let areaName = config.areaName;
  let req = new Request(
    `https://api.coronavirus.data.gov.uk/v2/data?areaType=${areaType}&areaName=${areaName}` +
    "&metric=cumPeopleVaccinatedFirstDoseByPublishDate" +
    "&metric=newPeopleVaccinatedFirstDoseByPublishDate" +
    "&metric=cumPeopleVaccinatedSecondDoseByPublishDate" +
    "&metric=newPeopleVaccinatedSecondDoseByPublishDate" +
    "&format=json"
  );
  let response = await req.loadJSON();
  return response.body;
}

if (config.runsInApp) {
  // Demo for in-app testing
  let widgetConfig = getConfig("");
  let data = await getData(widgetConfig);
  let widget = createWidget(data);
  widget.presentSmall();
} else {
  // The real deal
  let widgetConfig = getConfig(args.widgetParameter);
  let data = await getData(widgetConfig);
  let widget = createWidget(data);
  Script.setWidget(widget);
}
