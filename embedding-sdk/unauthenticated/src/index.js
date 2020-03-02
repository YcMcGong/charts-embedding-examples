import "regenerator-runtime/runtime";
import $ from "jquery";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const sdk = new ChartsEmbedSDK({
  baseUrl: "https://charts.mongodb.com/charts-tomh-yfpqi" // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
});

const chart = sdk.createChart({
  chartId: "92f7af7d-de64-4772-9bf4-b6fd2f59ac59", // Optional: ~REPLACE~ with the Chart ID from your Embed Chart dialog
  height: "700px"
});

async function renderChart() {
  await chart.render(document.getElementById("chart"));

  /*
    chart.refresh()
    Manually fetches the latest data for the chart
   */
  $("#refresh").on("click", () => {
    chart.refresh();
  });

  /*
    chart.setRefreshInterval(interval: number)
    The default rate is to never refresh after rendering.
    The minimum rate is every 10 seconds.
    Setting to 0 returns the chart to the default setting.

    chart.getRefreshInterval()
    Returns a number pertaining to the charts current
    refresh interval.
   */
  $("#refresh-interval").on("change", async e => {
    var refreshInterval = e.target.value;
    refreshInterval
      ? chart.setRefreshInterval(Number(refreshInterval))
      : chart.setRefreshInterval(0);

    var currentRefreshInterval = await chart.getRefreshInterval();
    $("#currentRefreshInterval").text(currentRefreshInterval);
  });

  /*
    chart.setFilter(filter: object)
    Filters the chart with the given filter string.
    It's important to manually whitelist fields you want users
    to be able to filter on. Do this in the Embedded settings of 
    your chart. 

    chart.getFilter()
    Returns the current filter object. The key is the field,
    and the value the query.
   */
  $("#country-filter").on("change", async e => {
    const country = e.target.value;
    if (country) {
      await chart.setFilter({ "address.country": country }); // Optional: ~REPLACE~ with the your own whitelisted field
      const filter = await chart.getFilter();
      $("#currentFilter").text(JSON.stringify(filter));
    } else {
      await chart.setFilter({});
      const filter = await chart.getFilter();
      $("#currentFilter").text(JSON.stringify(filter));
    }
  });

  /*
    chart.setTheme(theme: 'dark' | 'light');
    When the chart is set to dark, it's background becomes transparent.
    It is important when activating this setting you set the background of 
    the body to an appropriate colour.

    chart.getTheme()
    The current state of the charts theme is maintained by the chart.
    Returns a string.
   */
  $("#themeSwitch").change(async function() {
    if (this.checked) {
      await chart.setTheme("dark");
      document.body.classList.toggle("dark-mode", true);
    } else {
      await chart.setTheme("light");
      document.body.classList.toggle("dark-mode", false);
    }

    var currentTheme = await chart.getTheme();
    $("#currentTheme").text(currentTheme);
  });
}

renderChart().catch(e => window.alert(e.message));
