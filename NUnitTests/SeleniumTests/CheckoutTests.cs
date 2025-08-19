using NUnit.Framework;
using NUnitTests.Helpers;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System.Net.NetworkInformation;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  internal class CheckoutTests: PageTest
  {
    public string titleElement = ".shopLayoutTransparent h2";
    public string coSubmit = ".checkoutSubmitBtnGroup button[type=\"submit\"]";
    public string autoBtn = ".checkoutSubmitBtnGroup button[type=\"button\"]";
    public string validationElement = ".error";
    public string fieldElement = "input.form-control";
    public string coSuccess = "#noShopLayout .shopLayoutTransparent";
    public string myOrders = ".mgNavLinkBtn[href=\"/myorders\"]";
    
    IWebElement? myOrdBtn = null;

    IWebElement? v_firstName = null;
    IWebElement? v_lastName = null;
    IWebElement? v_line1 = null;
    IWebElement? v_line2 = null;
    IWebElement? v_line3 = null;
    IWebElement? v_city = null;
    IWebElement? v_state = null;
    IWebElement? v_country = null;
    IWebElement? v_zip = null;
    IWebElement? v_email = null;

    string? s_firstName = null;
    string? s_lastName = null;
    string? s_line1 = null;
    string? s_line2 = null;
    string? s_line3 = null;
    string? s_city = null;
    string? s_state = null;
    string? s_country = null;
    string? s_zip = null;
    string? s_email = null;

    string? c_firstName = null;
    string? c_lastName = null;
    string? c_line1 = null;
    string? c_line2 = null;
    string? c_line3 = null;
    string? c_city = null;
    string? c_state = null;
    string? c_country = null;
    string? c_zip = null;
    string? c_email = null;

    public void GoToCheckout()
    {
      driver.Navigate().GoToUrl(viteUrl + "/checkout");
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      try{
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(titleElement)));
      }
      catch (WebDriverTimeoutException)
      {
        Assert.Fail(pageOrElementMissing); return;
      }
      IWebElement element = driver.FindElement(By.CssSelector(titleElement));
      Assert.That(element.Text, Does.Contain("Checkout"), "Checkout - title is incorrect.");
    }

    public void GetValidations(List<IWebElement> vals)
    {
      v_firstName = vals[0];
      v_lastName = vals[1];
      v_line1 = vals[2];
      v_line2 = vals[3];
      v_line3 = vals[4];
      v_city = vals[5];
      v_state = vals[6];
      v_country = vals[7];
      v_zip = vals[8];
      v_email = vals[9];

      s_firstName = v_firstName.Text;
      s_lastName = v_lastName.Text;
      s_line1 = v_line1.Text;
      s_line2 = v_line2.Text;
      s_line3 = v_line3.Text;
      s_city = v_city.Text;
      s_state = v_state.Text;
      s_country = v_country.Text;
      s_zip = v_zip.Text;
      s_email = v_email.Text;
    }

    public void GetFields(List<IWebElement> fields)
    {
      c_firstName = fields[0].Text;
      c_lastName = fields[1].Text;
      c_line1 = fields[2].Text;
      c_line2 = fields[3].Text;
      c_line3 = fields[4].Text;
      c_city = fields[5].Text;
      c_state = fields[6].Text;
      c_country = fields[7].Text;
      c_zip = fields[8].Text;
      c_email = fields[9].Text;
    }

    [Test]
    public void EmptyCheckoutPage_LoadsSuccessfully(){
      GoToCheckout();
    }

    [Test]
    public void SubmitEmpty_ShowsClientValidation()
    {
      GoToCheckout();
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      try{
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.CssSelector(coSubmit)));
        clickableButton.Click();
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(validationElement)));
        IReadOnlyCollection<IWebElement> validations = driver.FindElements(By.CssSelector(validationElement));
        List<IWebElement> vals = validations.ToList();
        GetValidations(vals);
      }
      catch(WebDriverTimeoutException ex){
        Assert.Fail("Timeout during SubmitEmpty_ShowsClientValidation");
      }
      Assert.That(s_firstName, Does.Contain("First Name is required."), "Checkout - first name - validation - msg incorrect.");
      Assert.That(s_lastName,  Does.Contain(""),                        "Checkout - last name  - validation - msg incorrect.");

      Assert.That(s_line1, Does.Contain("Address Line 1 is required."), "Checkout - line 1     - validation - msg incorrect.");
      Assert.That(s_line2, Does.Contain(""),                            "Checkout - line 2     - validation - msg incorrect.");
      Assert.That(s_line3, Does.Contain(""),                            "Checkout - line 3     - validation - msg incorrect.");

      Assert.That(s_city,    Does.Contain("City is required."),    "Checkout - city    - validation - msg incorrect.");
      Assert.That(s_state,   Does.Contain("State is required."),   "Checkout - state   - validation - msg incorrect.");
      Assert.That(s_country, Does.Contain("Country is required."), "Checkout - country - validation - msg incorrect.");
      Assert.That(s_zip,     Does.Contain("Zip is required."),     "Checkout - zip     - validation - msg incorrect.");

      Assert.That(s_email, Does.Contain("Email is required."),     "Checkout - email   - validation - msg incorrect.");
    }

    [Test]
    public void SubmitAutofill1_ShowsCheckoutSuccess()
    {
      GoToCheckout();
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      try
      {
        IWebElement autoButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.CssSelector(autoBtn)));
        autoButton.Click();

        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(fieldElement)));
        IReadOnlyCollection<IWebElement> allFields = driver.FindElements(By.CssSelector(fieldElement));
        List<IWebElement> fields = allFields.ToList();
        GetFields(fields);

        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.CssSelector(coSubmit)));
        clickableButton.Click();

        IWebElement coSuccessElement = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(coSuccess)));
        string successText = TestHelpers.TrimAndFlattenString(coSuccessElement.Text);
        Assert.That(successText, Does.Contain("Thanks!"), "Checkout - success - Title - incorrect.");
        Assert.That(successText, Does.Contain("Your order has been submitted. We'll ship your goods as soon as possible."), "Checkout - success - Message - incorrect.");
        Assert.That(successText, Does.Contain("Continue Shopping"), "Checkout - success - Button - incorrect.");
        Assert.That(driver.Url, Does.Contain("/checkoutsuccess"), "Failed to reach checkout success page.");
        
        myOrdBtn = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(myOrders)));
        wait.Until(ExpectedConditions.TextToBePresentInElement(myOrdBtn, "My Orders (1)"));
      }
      catch (WebDriverTimeoutException ex)
      {
        Assert.Fail("Timeout during SubmitEmpty_ShowsClientValidation");
      }
      Assert.That(myOrdBtn.Text, Does.Contain("My Orders (1)"), "Checkout - success - My Orders Button - incorrect.");
    }
  }
}
