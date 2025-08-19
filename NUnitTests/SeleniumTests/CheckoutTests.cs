using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  internal class CheckoutTests: PageTest
  {
    public string titleElement = ".shopLayoutTransparent h2";
    public string coSubmit = ".checkoutSubmitBtnGroup button[type=\"submit\"]";
    public string validationElement = ".error";

    IWebElement v_firstName = null;
    IWebElement v_lastName = null;
    IWebElement v_line1 = null;
    IWebElement v_line2 = null;
    IWebElement v_line3 = null;
    IWebElement v_city = null;
    IWebElement v_state = null;
    IWebElement v_country = null;
    IWebElement v_zip = null;
    IWebElement v_email = null;

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
  }
}
