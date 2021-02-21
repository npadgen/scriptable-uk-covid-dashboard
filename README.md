# scriptable-uk-covid-dashboard

This is a small Scriptable iOS widget to show the latest UK government COVID-19 figure for your local area (MSOA), or the number of vaccinations for your country or the UK as a whole.

## To use the COVID cases widget

This widget displays the number of cases per 100,000.

* Paste the contents of `uk-covid-widget.js` into Scriptable as a new script.  Call it "UK Coronavirus Rate".
* Find your local MSOA area by going to https://coronavirus.data.gov.uk/details/download .  Pick MSOA from the Area Type and drill down to the area of interest.  Pick one of the metrics (it doesn't matter which).
* Copy the contents of the "Permanent Link" box.
* Add a new small Scriptable widget to your home page.
* Configure the widget and select the script "UK Coronavirus Rate".
* Paste the contents of the "Permanent Link" box as the Parameter.

## To use the vaccinations widget

This widget displays the number of 1st and 2nd doses which have been delivered in total and since yesterday.

 * Paste the contents of `uk-covid-vaccinations-widget.js` into Scriptable as a new script. Call it "UK COVID Vaccinations".
 * Add a new small Scriptable widget to your home page.
 * Configure the widget and select the script "UK COVID Vaccinations".
 * If you want the UK figures, set the Parameter to be empty.
 * If you want the figures for a country, set the Parameter to be "England", "Northern Ireland", "Scotland" or "Wales".
