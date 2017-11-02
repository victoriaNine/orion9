const langRegex = /\/(fr|en|jp)\//;

function getLanguageFromPath (location) {
  return location.match(langRegex);
}

function getLocationWithoutLang (location) {
  return location.replace(langRegex, '/');
}

function getLocationParams (location) {
  return getLocationWithoutLang(location).split('/').slice(1);
}

function getPageName (location) {
  return getLocationParams(location)[0];
}

function getWorkIdFromPath (location) {
  const locationParams = getLocationParams(location);
  return locationParams[locationParams.length - 1];
}

function getLanguageCode (code) {
  return code === 'jp' ? 'ja' : code;
}

function replaceStringToJSX (string, match, jsx, join) {
  const result = [];

  string.split(match).forEach((part, index, array) => {
    result.push(part);
    (index < array.length - 1) && result.push(jsx);
  });

  return join ? result.join("") : result;
}

export {
  langRegex,
  getLanguageFromPath,
  getLocationWithoutLang,
  getLocationParams,
  getPageName,
  getWorkIdFromPath,
  getLanguageCode,
  replaceStringToJSX
};