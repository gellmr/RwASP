const dateDisplayFormat = {
  hour: '2-digit',    // "09"
  minute: '2-digit',  // "30"
  second: '2-digit',  // "00"
  hour12: true,       // "AM/PM"
  weekday: 'long', // "Saturday"
  day: 'numeric',  // "19"
  month: 'long',   // "July"
  year: 'numeric', // "2025"
  timeZoneName: 'longOffset'
};

const displayDate = function (inString)
{
  const formattedString = new Date(inString).toLocaleDateString('en-US', dateDisplayFormat);
  const splitRes = formattedString.split("GMT");
  const datePart = splitRes[0]; // eg "Saturday, July 19, 2025 at 09:38:10 PM "
  const tzPart = splitRes[1];   // eg "+08:00"
  return (
    <>
      {datePart}
      <span style={{ color: '#919191' }}>
        {tzPart}
      </span>
    </>
  );
}
export default displayDate;