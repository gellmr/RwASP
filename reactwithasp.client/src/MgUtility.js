
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

function addressSegment(seg, final=false) {
  if (nullOrUndefined(seg)) { return ""; }
  if (!final) { return seg + ", " }
  return seg;
}

function oneLineAddress(address) {
  if (nullOrUndefined(address)) { return ""; }
  return (
    addressSegment(address.line1) +
    addressSegment(address.line2) +
    addressSegment(address.line3) +
    addressSegment(address.city) +
    addressSegment(address.state) +
    addressSegment(address.country) +
    addressSegment(address.zip, true)
  );
}

export { nullOrUndefined, isNullOrEmpty, oneLineAddress }