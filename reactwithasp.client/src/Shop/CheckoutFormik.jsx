import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { nullOrUndefined } from '@/MgUtility.js';
import { axiosInstance } from '@/axiosDefault.jsx';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2,   'First Name must be at least 2 characters long.')
    .required('First Name is required.'),
  email: Yup.string()
    .email('Invalid email format.')
    .required('Email is required.'),
});

const CheckoutFormik = () =>
{
  const initVals = {
    firstName: '',
    email: ''
  };

  const autoFill = function () {
    formik.setFieldValue('firstName', 'John');
    formik.setFieldValue('email', 'test@example.com');
  }

  const validateBeforeSubmit = (e) =>
  {
    e.preventDefault(); // Dont submit yet. Run Formik validation...
    formik.validateForm().then(errors => {
      if (Object.keys(errors).length > 0) {
        formik.setTouched({ firstName: true, email: true }); // Fields must be touched so Formik will display errors.
        return;
      }
      formik.handleSubmit(e); // Pass to formik onSubmit function.
    });
  };

  const formikErr = function (formik, fieldName) {
    if (nullOrUndefined(formik) || nullOrUndefined(formik.touched) || nullOrUndefined(formik.errors)) {
      return (<></>);
    }
    return (
      <>
        {formik.touched[fieldName] && formik.errors[fieldName] ? <div className="error">{ formik.errors[fieldName] }</div> : null}
      </>
    );
  }

  const formik = useFormik({
    initialValues: initVals,
    validationSchema: validationSchema,
    onSubmit: values =>
    {
      // This function will only be called if validation passes
      const jsonData = JSON.stringify(values, null, 2);
      //alert(jsonData);
      const url = window.location.origin + "/api/checkout/submit";
      const options = { headers: { 'Content-Type': 'application/json' } };
      axiosInstance.post(url, jsonData, options).then((response) => {
        //dispatch(setAdminProducts(response.data));
        //navigate('/admin/orders/1');
        console.log('Submitted');
      })
      .catch((error) => {
        console.log('Error ' + error);
        //dispatch(setAdminProducts([]));
      })
      .finally(() => {
        console.log('Complete');
      });
    },
  });

  return (
    <form onSubmit={validateBeforeSubmit}>

      <div>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" name="firstName" type="text" onChange={formik.handleChange} value={formik.values.firstName} />
        {formikErr(formik, "firstName")}
      </div>

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