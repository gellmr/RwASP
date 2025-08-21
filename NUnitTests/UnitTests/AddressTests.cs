using ReactWithASP.Server.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NUnitTests.UnitTests
{

  public static class AddressGen
  {
    public static Address GetDefault()
    {
      return new Address {
        Line1 = "Unit 1/100, 3-3 #44 Main St.",
        Line2 = null,
        Line3 = null,
        City = "Anytown",
        State = "WA",
        Country = "Australia",
        Zip = "1234"
      };
    }

    public static Address GetCrazyButValid()
    {
      return new Address
      {
        Line1   = "P.O. Box 45-A,    ////....----####aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa100",
        City    = "The 1000 Island Province - Island 33, Peninsula 2.",
        State   = "The 1000 Island Province - Island 33, Peninsula 2.",
        Country = "The 1000 Island Province - Island 33, Peninsula 2.",
        Zip     = "9999"
      };
    }

    public static Address GetInvalidWithXss()
    {
      string? xss = "<script>alert('XSS');</script>";
      return new Address
      {
        Line1 = xss,
        Line2 = xss,
        Line3 = xss,
        City = xss,
        State = xss,
        Country = xss,
        Zip = xss
      };
    }
  }

  [TestFixture]
  public class AddressTests
  {
    public void ShouldBeValid(Address address)
    {
      try
      {
        // Arrange
        var validationContext = new ValidationContext(address, null, null);
        var validationResults = new List<ValidationResult>();
        // Act
        bool isValid = Validator.TryValidateObject(address, validationContext, validationResults, true);
        // Assert
        Assert.That(isValid, Is.True);
        Assert.That(validationResults, Is.Empty);
      }
      catch (Exception ex){
        Console.WriteLine("ShouldBeValid() - An error occurred: " + ex.Message);
      }
    }

    public void ShouldNotBeValid(Address address)
    {
      try
      {
        // Arrange
        var validationContext = new ValidationContext(address, null, null);
        var validationResults = new List<ValidationResult>();
        // Act
        bool isValid = Validator.TryValidateObject(address, validationContext, validationResults, true);
        // Assert
        Assert.That(isValid, Is.False);
        Assert.That(validationResults, Is.Not.Empty);
      }
      catch (Exception ex)
      {
        Console.WriteLine("ShouldNotBeValid() - An error occurred: " + ex.Message);
      }
    }

    [Test]
    public void GetDefault_ShouldBeValid(){
      Address address = AddressGen.GetDefault();
      ShouldBeValid(address);
    }

    [Test]
    public void GetCrazyButValid_ShouldBeValid(){
      Address address = AddressGen.GetCrazyButValid();
      ShouldBeValid(address);
    }

    [Test]
    public void GetDefault_WithLine1Err_ShouldNotBeValid(){
      Address address = AddressGen.GetDefault();
      address.Line1 = address.Line1 + "<"; // illegal character
      ShouldNotBeValid(address);
    }

    [Test]
    public void GetDefault_WithEmptyLine1_ShouldNotBeValid(){
      Address address = AddressGen.GetDefault();
      address.Line1 = string.Empty;
      ShouldNotBeValid(address);
    }

    [Test]
    public void GetInvalidWithXss_ShouldNotBeValid(){
      Address hackyAddress = AddressGen.GetInvalidWithXss();
      ShouldNotBeValid(hackyAddress);
    }

    [Test]
    public void GetDefaultWithPostCodeTooShort_ShouldNotBeValid()
    {
      Address address = AddressGen.GetDefault();
      address.Zip = "123";
      ShouldNotBeValid(address);
    }

    [Test]
    public void GetDefaultWithPostCodeTooLong_ShouldNotBeValid(){
      Address address = AddressGen.GetDefault();
      address.Zip = "12345";
      ShouldNotBeValid(address);
    }

    [Test]
    public void GetDefaultWithLine2And3_ShouldBeValid()
    {
      Address address = AddressGen.GetDefault();
      address.Line2 = address.Line1;
      address.Line3 = address.Line1;
      ShouldBeValid(address);
    }

    [Test]
    public void GetDefaultWithLine2And3Null_ShouldBeValid()
    {
      Address address = AddressGen.GetDefault();
      address.Line2 = null;
      address.Line3 = null;
      ShouldBeValid(address);
    }
    [Test]
    public void GetDefaultWithLine2And3Empty_ShouldBeValid()
    {
      Address address = AddressGen.GetDefault();
      address.Line2 = string.Empty;
      address.Line3 = string.Empty;
      ShouldBeValid(address);
    }
  }
}
