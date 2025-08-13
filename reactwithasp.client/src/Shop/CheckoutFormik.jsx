import React from 'react';
import * as Yup from 'yup';
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik';
import { nullOrUndefined } from '@/MgUtility.js';
import { axiosInstance } from '@/axiosDefault.jsx';
import InputGroup from 'react-bootstrap/InputGroup';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2,   'First Name must be at least 2 characters long.')
    .required('First Name is required.')
  ,lastName: Yup.string()
    .min(2, 'Last Name must be at least 2 characters long.')
  ,email: Yup.string()
    .email('Invalid email format.')
    .required('Email is required.')
});

const CheckoutFormik = () =>
{
  const initVals = {
    firstName: '',
    lastName: '',
    email: ''
  };

  const autoFill = function () {
    formik.setFieldValue('firstName', 'John');
    formik.setFieldValue('lastName',  'Doe');
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

  return (
    <form onSubmit={validateBeforeSubmit}>

      <InputGroup className="mb-1">
        <span class="input-group-text">First Name</span>
        <input class="form-control" id="firstName" name="firstName" type="text" onChange={formik.handleChange} value={formik.values.firstName} />
      </InputGroup>
      <div class="mb-1 text-center">
        {formikErr(formik, "firstName")}
      </div>

      <InputGroup className="mb-3">
        <span class="input-group-text">Last Name</span>
        <input class="form-control" id="lastName" name="lastName" type="text" onChange={formik.handleChange} value={formik.values.lastName} />
      </InputGroup>
      <div>{formikErr(formik, "lastName")}</div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email} />
        {formikErr(formik, "email")}
      </div>

      <button type="button" onClick={autoFill}>Autofill</button>
      <button type="submit">Complete Order</button>
    </form>
  );
};

export default CheckoutFormik;