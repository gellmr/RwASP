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
  }

  [TestFixture]
  public class AddressTests
  {
    [Test]
    public void Line1_ShouldBeValid()
    {
      // Arrange
      Address address = AddressGen.GetDefault();
      var validationContext = new ValidationContext(address, null, null);
      var validationResults = new List<ValidationResult>();
      // Act
      bool isValid = Validator.TryValidateObject(address, validationContext, validationResults, true);
      // Assert
      Assert.That(isValid, Is.True);
      Assert.That(validationResults, Is.Empty);
    }

    [Test]
    public void Line1_CrazyShouldBeValid()
    {
      // Arrange
      Address address = AddressGen.GetCrazyButValid();
      var validationContext = new ValidationContext(address, null, null);
      var validationResults = new List<ValidationResult>();
      // Act
      bool isValid = Validator.TryValidateObject(address, validationContext, validationResults, true);
      // Assert
      Assert.That(isValid, Is.True);
      Assert.That(validationResults, Is.Empty);
    }


  }
}
