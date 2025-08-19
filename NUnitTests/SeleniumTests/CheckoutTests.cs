using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  internal class CheckoutTests: PageTest
  {
    string titleElement = ".shopLayoutTransparent h2";

    [Test]
    public void EmptyCheckoutPage_LoadsSuccessfully()
    {
      driver.Navigate().GoToUrl(viteUrl + "/checkout");
      var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
      try{
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(titleElement)));
      }
      catch (WebDriverTimeoutException){
        Assert.Fail(pageOrElementMissing);
      }
      IWebElement element = driver.FindElement(By.CssSelector(titleElement));
      Assert.That(element.Text, Does.Contain("Checkout"), "Checkout - title is incorrect.");
    }
  }
}
