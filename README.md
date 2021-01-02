# scriptable-uk-covid-dashboard

This is a small Scriptable iOS widget to show the latest UK government COVID-19 figure for your local area (MSOA).

To use:

* Find your local MSOA area by going to https://coronavirus.data.gov.uk/details/download .  Pick MSOA from the Area Type and drill down to the area of interest.  Pick one of the metrics (it doesn't matter which).
* Look in the "Permanent link" box, which will include `areaCode=XNNNNNNNN`.  You need the bit after that.
* Paste the contents of `uk-covid-dashboard.js` into a new Scriptable widget.
* When you add the widget to your iOS screen, include your area code as the parameter.
