import { nullOrUndefined, isNullOrEmpty } from '@/MgUtility.js';

const autoVal = [
  {
    "firstName" : "John",
    "lastName"  : "Doe",
    "shipLine1"   : "123 River Gum Way",
    "shipLine2"   : "Unit 10/150, Third Floor",
    "shipLine3"   : "The Tall Apartment Building (Inc)",
    "shipCity"      : "SpringField",
    "shipState"     : "WA",
    "shipCountry"   : "Australia",
    "shipZip"       : "6525",
    "shipEmail" : "john@example.com",
  },
  {
    "firstName" : "Eliza",
    "lastName"  : "Parks",
    "shipLine1":  "90 Taylors Rd",
    "shipLine2"   : "",
    "shipLine3"   : "",
    "shipCity"      : "Keilor Downs",
    "shipState"     : "VIC",
    "shipCountry"   : "Australia",
    "shipZip"       : "3038",
    "shipEmail" : "eparks@research.sportcom",
  },
  {
    "firstName" : "Arnold",
    "lastName"  : "Mosley",
    "shipLine1"   : "64 Orange Grove Rd",
    "shipLine2"   : "",
    "shipLine3"   : "",
    "shipCity"      : "Liverpool",
    "shipState"     : "NSW",
    "shipCountry"   : "Australia",
    "shipZip"       : "2170",
    "shipEmail" : "mosley@distantsound.net",
  },
];

const checkoutAutofill = function (formik, index)
{
  const newValues = autoVal[index];
  formik.setValues(newValues, true); // Await formik values to update. Run validation.
  return index == autoVal.length - 1;
}

const checkoutValuesfill = function (formik, initVals)
{
  const newValues = {
    'firstName': initVals.firstName || "",
    'lastName':  initVals.lastName  || "",
    'shipLine1': initVals.shipLine1 || "Unit 5, Level 10",
    'shipLine2': initVals.shipLine2 || "95 Stirling Street",
    'shipLine3': initVals.shipLine3 || "",
    'shipCity':  initVals.shipCity  || "Perth",
    'shipState': initVals.shipState || "WA",
    'shipCountry': initVals.shipCountry || "Australia",
    'shipZip':     initVals.shipZip     || "6000",
    'shipEmail':   initVals.shipEmail   || ""
  };
  formik.setValues(newValues, true); // Await formik values to update. Run validation.
}

export { checkoutAutofill, checkoutValuesfill }