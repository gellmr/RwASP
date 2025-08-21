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
  const vals = autoVal[index];
  formik.setFieldValue('firstName',   vals.firstName);
  formik.setFieldValue('lastName',    vals.lastName);
  formik.setFieldValue('shipLine1',   vals.shipLine1 );
  formik.setFieldValue('shipLine2',   vals.shipLine2 );
  formik.setFieldValue('shipLine3',   vals.shipLine3 );
  formik.setFieldValue('shipCity',    vals.shipCity );
  formik.setFieldValue('shipState',   vals.shipState );
  formik.setFieldValue('shipCountry', vals.shipCountry );
  formik.setFieldValue('shipZip',     vals.shipZip );
  formik.setFieldValue('shipEmail',   vals.shipEmail );
  return index == autoVal.length - 1;
}

const checkoutValuesfill = function (formik, initVals) {
  formik.setFieldValue('firstName',   initVals.firstName   || "");
  formik.setFieldValue('lastName',    initVals.lastName    || "");
  formik.setFieldValue('shipLine1',   initVals.shipLine1   || "Unit 5, Level 10");
  formik.setFieldValue('shipLine2',   initVals.shipLine2   || "95 Stirling Street");
  formik.setFieldValue('shipLine3',   initVals.shipLine3   || "");
  formik.setFieldValue('shipCity',    initVals.shipCity    || "Perth");
  formik.setFieldValue('shipState',   initVals.shipState   || "WA");
  formik.setFieldValue('shipCountry', initVals.shipCountry || "Australia");
  formik.setFieldValue('shipZip',     initVals.shipZip     || "6000");
  formik.setFieldValue('shipEmail',   initVals.shipEmail   || "");
}

export { checkoutAutofill, checkoutValuesfill }