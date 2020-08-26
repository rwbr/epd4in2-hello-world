const DarkSkyApi = require("dark-sky-api");

DarkSkyApi.apiKey = "e7645432203388428ec1994d51d1f726";
DarkSkyApi.proxy = true;

DarkSkyApi.units = "si"; // default 'us'
DarkSkyApi.language = "de"; // default 'en'
DarkSkyApi.postProcessor = item => {
  // default null;
  item.day = item.dateTime.format("ddd");
  return item;
};

const position = {
  latitude: 52.0391388,
  longitude: 8.483905999999934
};
DarkSkyApi.loadCurrent(position).then(result => console.log(result));
