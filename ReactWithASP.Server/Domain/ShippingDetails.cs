﻿using ReactWithASP.Server.Infrastructure;
using System.ComponentModel.DataAnnotations;

namespace ReactWithASP.Server.Domain
{
  public class ShippingDetails
  {
    [Required(ErrorMessage = "Please enter your First Name")]
    [RegularExpression(OkInputs.Name, ErrorMessage = OkInputs.NameErr)]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Please enter your Last Name")]
    [RegularExpression(OkInputs.Name, ErrorMessage = OkInputs.NameErr)]
    public string LastName { get; set; }



    [Required(ErrorMessage = "Please enter the first address line")]
    [RegularExpression(OkInputs.Line, ErrorMessage = OkInputs.LineErr)]
    [Display(Name = "Line 1")]
    public string Line1 { get; set; }

    [RegularExpression(OkInputs.Line, ErrorMessage = OkInputs.LineErr)]
    [Display(Name = "Line 2")]
    public string Line2 { get; set; }

    [RegularExpression(OkInputs.Line, ErrorMessage = OkInputs.LineErr)]
    [Display(Name = "Line 3")]
    public string Line3 { get; set; }



    [RegularExpression(OkInputs.Name, ErrorMessage = OkInputs.NameErr)]
    [Required(ErrorMessage = "Please enter a city name")]
    public string City { get; set; }

    [RegularExpression(OkInputs.Name, ErrorMessage = OkInputs.NameErr)]
    [Required(ErrorMessage = "Please enter a state name")]
    public string State { get; set; }

    [RegularExpression(OkInputs.Name, ErrorMessage = OkInputs.NameErr)]
    [Required(ErrorMessage = "Please enter a country name")]
    public string Country { get; set; }



    [RegularExpression(OkInputs.Zip, ErrorMessage = OkInputs.ZipErr)]
    [Required(ErrorMessage = "Please enter your postcode")]
    public string Zip { get; set; }

    //[EmailAddress(ErrorMessage = "Invalid Email Address")]
    [RegularExpression(OkInputs.Email, ErrorMessage = OkInputs.EmailErr)]
    [Display(Name = "Email")]
    [Required(ErrorMessage = "Email address is required")]
    public string Email { get; set; }



    //public bool GiftWrap { get; set; }
  }
}
