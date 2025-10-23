/**
 * Get Initials
 *
 * @param firstName
 * @param lastName
 * @returns {string}
 */
function getInitials(firstName, lastName = "") {
  let string = "";

  if (firstName) {
    string += firstName.charAt(0);

    if (!lastName && firstName.length > 1) {
      string += firstName.charAt(1);
    }
  }

  if (lastName) {
    string += lastName.charAt(0);

    if (!firstName && lastName.length > 1) {
      string += lastName.charAt(1);
    }
  }

  return string.toUpperCase();
}

/**
 * Format to Two Decimals
 *
 * @param number
 * @returns {string}
 */
function formatToTwoDecimals(number) {
  number = parseFloat(number) || 0;

  return Number(number).toFixed(2);
}

/**
 * Format Price
 *
 * @param price
 * @returns {*}
 */
function formatPrice(price) {
  if (!price) {
    return null;
  }

  return `$${formatToTwoDecimals(price)}`;
}

/**
 * Get Current Year
 */
function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Get Random Color Code
 *
 * @returns
 */
function getColorCode() {
  let makeColorCode = "0123456789ABCDEF",
    code = "#";
  for (let count = 0; count < 6; count++) {
    code = code + makeColorCode[Math.floor(Math.random() * 16)];
  }

  return code;
}

export { formatToTwoDecimals, formatPrice, getInitials, getCurrentYear, getColorCode };
