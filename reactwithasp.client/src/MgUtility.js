
const nullOrUndefined = function (arg) {
  return (
    arg === undefined || arg == null
  );
}

/* Examples
  console.log(isNullOrEmpty(null));        // true
  console.log(isNullOrEmpty(undefined));   // true
  console.log(isNullOrEmpty(''));          // true
  console.log(isNullOrEmpty('   '));       // true
  console.log(isNullOrEmpty('hello'));     // false
 */
function isNullOrEmpty(value) {
  return (value == null || (typeof value === 'string' && value.trim().length === 0));
}


function oneLineAddress(address) {
  if (nullOrUndefined(address)) { return ""; }
  return (
    address.line1 + ", " +
    address.line2 + ", " +
    address.line3 + ", " +
    address.city + ", " +
    address.state + ", " +
    address.country + ", " +
    address.zip
  );
}

export { nullOrUndefined, isNullOrEmpty, oneLineAddress }