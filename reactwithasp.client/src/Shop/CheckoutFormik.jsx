import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { nullOrUndefined, isNullOrEmpty } from '@/MgUtility.js';
import { checkoutAutofill } from '@/Autofill.js';
import { axiosInstance } from '@/axiosDefault.jsx';
import InputGroup from 'react-bootstrap/InputGroup';

import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router";
import { clearCart } from '@/features/cart/cartSlice.jsx'
import { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const validationSchema = Yup.object({
  firstName:  Yup.string().min( 2, 'First Name must be at least 2 characters long.').required('First Name is required.')
  ,lastName:  Yup.string().min( 2, 'Last Name must be at least 2 characters long.')
  ,shipLine1: Yup.string().min( 2, 'Address Line 1 must be at least 2 characters long.').required('Address Line 1 is required.')
  //,shipLine2: Yup.string().min( 2, 'Address Line 2 must be at least 2 characters long.')
  //,shipLine3: Yup.string().min( 2, 'Address Line 3 must be at least 2 characters long.')
  ,shipCity:    Yup.string().min(2, 'City must be at least 2 characters long.').required(    'City is required.')
  ,shipState:   Yup.string().min(2, 'State must be at least 2 characters long.').required(   'State is required.')
  ,shipCountry: Yup.string().min(2, 'Country must be at least 2 characters long.').required( 'Country is required.')
  ,shipZip:     Yup.string().min(4, 'Zip must be at least 4 characters long.').required(     'Zip is required.')
  ,shipEmail:   Yup.string().email( 'Invalid email format.').required('Email is required.')
});

const CheckoutFormik = () =>
{
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [autoFillIdx, setAutoFillIdx] = useState(0);

  const cart = useSelector(state => state.cart.cartLines);

  let _firstname;
  let _lastname;

  const guest = useSelector(state => state.login.guest);
  const guestID = !nullOrUndefined(guest) ? guest.id : null;

  _firstname = (guest === null) ? '' : guest.firstname;
  _lastname = (guest === null) ? '' : guest.lastname;

  const loginValue = useSelector(state => state.login.user);
  const myUserId = (loginValue === null) ? undefined : loginValue.appUserId;

  _firstname = (loginValue === null) ? _firstname : loginValue.firstname;
  _lastname = (loginValue === null) ? _lastname : loginValue.lastname;

  let _email = (loginValue === null) ? '' : loginValue.email;

  const initVals = {
    firstName: nullOrUndefined(_firstname) ? '' : _firstname,
    lastName:  nullOrUndefined(_lastname)  ? '' : _lastname,
    shipLine1: '',
    shipLine2: '',
    shipLine3: '',
    shipCity: '',
    shipState: '',
    shipCountry: '',
    shipZip: '',
    shipEmail: nullOrUndefined(_email) ? '' : _email,
  };

  const useAutoFill = (nullOrUndefined(myUserId)) ? true : false;

  const autoFill = async function ()
  {
    if (useAutoFill) {
      let reset = checkoutAutofill(formik, autoFillIdx);
      let i = reset ? 0 : autoFillIdx + 1;
      setAutoFillIdx(i);
      await formik.validateForm(); // Wait for the form values to update
      markAllFieldsAsTouched(formik.values, formik.setTouched); // Trigger this so the error messages will clear
    }
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
    onSubmit: async (values) =>
    {
      // This function will only be called if validation passes
      try {
        const url = window.location.origin + "/api/checkout/submit";
        const jsonData = { cart: structuredClone(cart), ...values };
        const options = { headers: { 'Content-Type': 'application/json' } };
        const response = await axiosInstance.post(url, jsonData, options);
        await dispatch(clearCart());
        navigate("/checkoutsuccess");
      } catch (error) {
        console.error('Error:', error);
      } finally {
        console.log('Complete');
      }
    },
  });

  const formikTextInput = function (fieldName, displayText, fieldType = "text") {
    const val = nullOrUndefined(formik.values[fieldName]) ? '' : formik.values[fieldName];
    return (
      <>
        <InputGroup className="mb-1">
          <span className="input-group-text">{displayText}</span>
          <input className="form-control" id={fieldName} name={fieldName} type={fieldType} onChange={formik.handleChange} value={val} />
        </InputGroup>
        <div className="mb-1 text-center">
          {formikErr(formik, fieldName)}
        </div>
      </>
    );
  }

  const autoFillTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to autofill the form with some generated test values
    </Tooltip>
  );

  return (
    <form onSubmit={validateBeforeSubmit}>
      {formikTextInput('firstName', "First Name")}
      {formikTextInput('lastName', "Last Name")}

      {formikTextInput('shipLine1', "Line 1")}
      {formikTextInput('shipLine2', "Line 2")}
      {formikTextInput('shipLine3', "Line 3")}

      {formikTextInput('shipCity',    "City")}
      {formikTextInput('shipState',   "State")}
      {formikTextInput('shipCountry', "Country")}
      {formikTextInput('shipZip',     "Zip")}
      {formikTextInput('shipEmail', "Email", "email")}

      <div role="group" className="checkoutSubmitBtnGroup btn-group">
      
        <OverlayTrigger placement="top" delay={{ show: 50, hide: 400 }} overlay={autoFillTooltip}>
          <button type="button" className="btn btn btn-light" onClick={autoFill}>
            <i className="bi bi-list-check"></i>&nbsp;Autofill
          </button>
        </OverlayTrigger>

        <button type="submit" className="btn btn-primary btn btn-success">Complete Order</button>
      </div>

    </form>
  );
};

export default CheckoutFormik;