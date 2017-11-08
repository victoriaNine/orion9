const eventsMap = {
  down: { touch: 'touchstart', desktop: 'mousedown' },
  up: { touch: 'touchend', desktop: 'mouseup' },
  move: { touch: 'touchmove', desktop: 'mousemove' },
};

const langRegex = /^\/(fr|en|jp)\//;

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
  switch (code) {
    case 'jp':
      return 'ja';
    default:
      return code;
  }
}

function replaceStringToJSX (string, match, jsx, join) {
  const result = [];

  string.split(match).forEach((part, index, array) => {
    result.push(part);
    (index < array.length - 1) && result.push(jsx);
  });

  return join ? result.join("") : result;
}

function getFirstChild (props) {
  return props.children[0] || null;
}

export {
  eventsMap,
  langRegex,
  getLanguageFromPath,
  getLocationWithoutLang,
  getLocationParams,
  getPageName,
  getWorkIdFromPath,
  getLanguageCode,
  replaceStringToJSX,
  getFirstChild,
};
