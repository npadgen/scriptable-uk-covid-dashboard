// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: info-circle;
function createWidget(data) {
  let infectionRate = data[0].newCasesBySpecimenDateRollingRate;
  let infectionDirection = data[0].newCasesBySpecimenDateDirection;
  let statsDate = data[0].date;

  let widget = new ListWidget();

  let title = widget.addText("🦠" + data[0].areaName);
  title.font = Font.boldSystemFont(16);
  title.minimumScaleFactor = 0.6;
  title.lineLimit = 2;

  let subTitle = widget.addText("Rate on " + statsDate);
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

async function getData(objectID) {
  let req = new Request(
    `https://api.coronavirus.data.gov.uk/v2/data?areaType=msoa&areaCode=${objectID}&metric=newCasesBySpecimenDateRollingSum&metric=newCasesBySpecimenDateRollingRate&metric=newCasesBySpecimenDateChange&metric=newCasesBySpecimenDateChangePercentage&metric=newCasesBySpecimenDateDirection&format=json`
  );
  let response = await req.loadJSON();
  return response.body;
}

if (config.runsInApp) {
  // Demo for in-app testing
  let data = await getData("E02003376");
  let widget = createWidget(data);
  widget.presentSmall();
} else {
  // The real deal
  let objectID = args.widgetParameter;
  let data = await getData(objectID);
  let widget = createWidget(data);
  Script.setWidget(widget);
}
