import React from 'react';
import * as Yup from 'yup';
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik';
import { nullOrUndefined } from '@/MgUtility.js';
import { axiosInstance } from '@/axiosDefault.jsx';
import InputGroup from 'react-bootstrap/InputGroup';

const validationSchema = Yup.object({
  firstName:  Yup.string().min( 2, 'First Name must be at least 2 characters long.').required('First Name is required.')
  ,lastName:  Yup.string().min( 2, 'Last Name must be at least 2 characters long.')
  ,shipLine1: Yup.string().min( 2, 'Address Line 1 must be at least 2 characters long.').required('Address Line 1 is required.')
  ,shipLine2: Yup.string().min( 2, 'Address Line 2 must be at least 2 characters long.')
  ,shipLine3: Yup.string().min( 2, 'Address Line 3 must be at least 2 characters long.')
  ,shipCity:    Yup.string().min(2, 'City must be at least 2 characters long.').required(    'City is required.')
  ,shipState:   Yup.string().min(2, 'State must be at least 2 characters long.').required(   'State is required.')
  ,shipCountry: Yup.string().min(2, 'Country must be at least 2 characters long.').required( 'Country is required.')
  ,shipZip:     Yup.string().min(4, 'Zip must be at least 4 characters long.').required(     'Zip is required.')
  ,email: Yup.string().email( 'Invalid email format.').required('Email is required.')
});

const CheckoutFormik = () =>
{
  const initVals = {
    firstName: '',
    lastName: '',
    shipLine1: '',
    shipLine2: '',
    shipLine3: '',
    shipCity: '',
    shipState: '',
    shipCountry: '',
    shipZip: '',
    email: ''
  };

  const autoFill = function () {
    formik.setFieldValue('firstName', 'John');
    formik.setFieldValue('lastName', 'Doe');
    formik.setFieldValue('shipLine1', '123 River Gum Way');
    formik.setFieldValue('shipLine2', 'Unit 10/150, Third Floor');
    formik.setFieldValue('shipLine3', 'The Tall Apartment Building (Inc)');
    formik.setFieldValue('shipCity',    'SpringField');
    formik.setFieldValue('shipState',   'WA');
    formik.setFieldValue('shipCountry', 'Australia');
    formik.setFieldValue('shipZip',     '6525');
    formik.setFieldValue('email', 'test@example.com');
  }

  const markAllFieldsAsTouched = (values, setTouched) => {
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(touchedFields);
  };

  const validateBeforeSubmit = (e) =>
  {
    e.preventDefault(); // Dont submit yet. Run Formik validation...
    formik.validateForm().then(errors => {
      if (Object.keys(errors).length > 0) {
        //formik.setTouched({ firstName: true, email: true }); 
        markAllFieldsAsTouched(formik.values, formik.setTouched); // Fields must be touched so Formik will display errors.
        return;
      }
      formik.handleSubmit(e); // Pass to formik onSubmit function.
    });
  };

  const formikErr = function (formik, fieldName) {
    if (nullOrUndefined(formik) || nullOrUndefined(formik.touched) || nullOrUndefined(formik.errors)) {
      return (
        <></>
      );
    }
    return (
      <div className="error">
        { formik.touched[fieldName] && formik.errors[fieldName] ? formik.errors[fieldName] : <>&nbsp;</> }
      </div>
    );
  }

  const formik = useFormik({
    initialValues: initVals,
    validationSchema: validationSchema,
    onSubmit: values =>
    {
      // This function will only be called if validation passes
      const jsonData = JSON.stringify(values, null, 2);
      const url = window.location.origin + "/api/checkout/submit";
      const options = { headers: { 'Content-Type': 'application/json' } };
      axiosInstance.post(url, jsonData, options).then((response) => {
        //dispatch();
        //navigate('');
        console.log('Submitted');
      })
      .catch((error) => {
        console.log('Error ' + error);
        //dispatch();
      })
      .finally(() => {
        console.log('Complete');
      });
    },
  });

  const formikTextInput = function (fieldName, displayText) {
    return (
      <>
        <InputGroup className="mb-1">
          <span class="input-group-text">{displayText}</span>
          <input class="form-control" id={fieldName} name={fieldName} type="text" onChange={formik.handleChange} value={formik.values[fieldName]} />
        </InputGroup>
        <div class="mb-1 text-center">
          {formikErr(formik, fieldName)}
        </div>
      </>
    );
  }

  return (
    <form onSubmit={validateBeforeSubmit}>
      {formikTextInput('firstName', "First Name")}
      {formikTextInput('lastName', "Last Name")}

      {formikTextInput('shipLine1', "Line 1")}
      {formikTextInput('shipLine2', "Line 2")}
      {formikTextInput('shipLine3', "Line 3")}

      {formikTextInput('shipCity',   "City")}
      {formikTextInput('shipState',  "State")}
      {formikTextInput('shipCoutry', "Country")}
      {formikTextInput('shipZip',    "Zip")}
      
      <InputGroup className="mb-1">
        <span class="input-group-text">Email</span>
        <input class="form-control" id="email" name="email" type="text" onChange={formik.handleChange} value={formik.values["email"]} />
      </InputGroup>
      <div class="mb-1 text-center">
        {formikErr(formik, "email")}
      </div>

      <button type="button" onClick={autoFill}>Autofill</button>
      <button type="submit">Complete Order</button>
    </form>
  );
};

export default CheckoutFormik;