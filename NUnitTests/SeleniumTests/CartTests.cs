using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using SeleniumExtras.WaitHelpers;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class CartTests : PageTest
  {
    [Test]
    public void EmptyCartPage_LoadsSuccessfully()
    {
      driver.Navigate().GoToUrl(viteUrl + "/cart");
      string titleElement = ".shopLayoutTransparent.bgCartFullTransparent h2";
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(titleElement))); // Wait for element to be visible on page.
      }
      catch (WebDriverTimeoutException){
        Assert.Fail(pageOrElementMissing);
      }
      IWebElement element = driver.FindElement(By.CssSelector(titleElement));
      Assert.That(element.Text, Does.Contain("Cart is Empty"), "Cart page - title is incorrect.");
    }
  }
}
