// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: user-md;
function createWidget(data) {
  let infectionRate = data[0].newCasesBySpecimenDateRollingRate;
  let infectionDirection = data[0].newCasesBySpecimenDateDirection;
  let statsDate = data[0].date;

  let widget = new ListWidget();

  let title = widget.addText("🦠" + data[0].areaName);
  title.font = Font.boldSystemFont(16);
  title.minimumScaleFactor = 0.6;
  title.lineLimit = 2;

  let subTitle = widget.addText(statsDate);
  subTitle.font = Font.regularSystemFont(12);
  subTitle.textColor = Color.gray();

  widget.addSpacer();

  let infectionVal = Math.round(infectionRate).toString();
  if (infectionDirection === "UP") {
    infectionVal += " ⬆︎";
  } else if (infectionDirection === "DOWN") {
    infectionVal += " ⬇︎";
  } else {
    infectionVal += " ⬌";
  }
  let infections = widget.addText(infectionVal);
  infections.font = Font.regularSystemFont(40);
  infections.centerAlignText();
  if (infectionDirection === "UP") {
    infections.textColor = Color.red();
  } else if (infectionDirection === "DOWN") {
    infections.textColor = Color.green();
  } else {
    infections.textColor = Color.orange();
  }

  widget.addSpacer();

  let footer = widget.addText(
    "was " +
      Math.round(data[1].newCasesBySpecimenDateRollingRate).toString() +
      " on " +
      data[1].date
  );
  footer.minimumScaleFactor = 0.5;
  footer.lineLimit = 1;
  footer.textColor = Color.gray();

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
  // widgetParameter can either be a json object with `areaType` and `areaCode`,
  // or it can be the URL from https://coronavirus.data.gov.uk/details/download
  let widgetConfig = {
    areaType: "",
    areaCode: "",
  };
  if (widgetParameter[0] === "{") {
    let areaParams = JSON.parse(widgetParameter);
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
  let req = new Request(
    `https://api.coronavirus.data.gov.uk/v2/data?areaType=${areaType}&areaCode=${areaCode}&metric=newCasesBySpecimenDateRollingSum&metric=newCasesBySpecimenDateRollingRate&metric=newCasesBySpecimenDateDirection&format=json`
  );
  let response = await req.loadJSON();
  return response.body;
}

if (config.runsInApp) {
  // Demo for in-app testing
  let widgetConfig = getConfig(
    //"https://foo.bar/?areaType=msoa&areaCode=E02003376"
    "https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=newCasesBySpecimenDateDirection&format=json"
  );
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
