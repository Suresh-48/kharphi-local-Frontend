/**
 * Get params by name
 */
export function getParamsByName(e) {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get(e);
}

/**
 * Get Cookie
 *
 * @param cname
 * @returns {string}
 */
export function getCookie(cname) {
  var nameEQ = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return "";
}

/**
 * Set Cookie
 *
 * @param cookieName
 * @param cookieValue
 * @param days
 */
export function setCookie(cookieName, cookieValue, days = 1) {
  var date, expires;
  if (days) {
    date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = cookieName + "=" + cookieValue + expires + "; path=/";
}

/**
 * From Array
 *
 * @param values
 * @returns {string}
 */
export function fromArray(values) {
  const arrayData = [];
  if (values && values.length > 0) {
    values.forEach((value) => {
      arrayData.push({ tagId: value.value });
    });
  }
  return arrayData ? arrayData : "";
}

/**
 * Clear Cookie
 *
 * @param name
 */
export function clearCookie(name) {
  setCookie(name, "", -24);
}
