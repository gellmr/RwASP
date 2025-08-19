using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using SeleniumExtras.WaitHelpers;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  internal class HomePageSoccerCat : PageTest
  {
    [Test]
    public void ClickOnSoccer_NavigatesToCorrectPage()
    {
      driver.Navigate().GoToUrl(viteUrl);
      const string buttonCss = ".mg-category-menu-r a.btn[href='/category/soccer']";
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        wait.Until(ExpectedConditions.ElementExists(By.CssSelector(buttonCss)));
        IReadOnlyCollection<IWebElement> catLinks = driver.FindElements(By.CssSelector(buttonCss));
        List<IWebElement> links = catLinks.ToList(); // There are 3 sizes used at different bootstrap breakpoints
        IWebElement smallLink = links[0];
        IWebElement medLink = links[1];
        IWebElement largeLink = links[2];
        IWebElement clickableLink = wait.Until(ExpectedConditions.ElementToBeClickable(largeLink));
        clickableLink.Click();
        Assert.That(driver.Url, Does.Contain("/category/soccer"));
        IReadOnlyCollection<IWebElement> products = driver.FindElements(By.CssSelector(".productDetails"));
        Assert.That(products.First().Text, Does.Contain("Soccer Goals $1000"), "First product - is missing.");
      }
      catch (WebDriverTimeoutException)
      {
        Assert.Fail("Timed out waiting for elements or page navigation.");
      }
    }
  }
}

