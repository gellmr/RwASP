using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using SeleniumExtras.WaitHelpers;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  internal class HomePageSoccerCat : PageTest
  {
    [Test]
    public void SoccerCat_LoadsSuccessfully()
    {
      driver.Navigate().GoToUrl(viteUrl + "/category/soccer");
      string productsSel = ".productDetails";
      string menuSelector = ".mg-category-menu-r a.btn.active"; // "Soccer" menu item
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(productsSel))); // Wait for element to be present.

        wait.Until(ExpectedConditions.ElementExists(By.CssSelector(menuSelector))); // Ignore visibility. Just check the menu items are in the dom.

        // Wait specifically for the menu item's text to be present.
        // This custom wait checks that the element is found and its text is not empty.
        //wait.Until(driver => {
        //  IReadOnlyCollection<IWebElement> menuItems = driver.FindElements(By.CssSelector(menuSelector));
        //  return menuItems.Any() && !string.IsNullOrEmpty(menuItems.First().Text);
        //});
      }
      catch (WebDriverTimeoutException)
      {
        Assert.Fail(pageOrElementMissing);
      }
      IReadOnlyCollection<IWebElement> products = driver.FindElements(By.CssSelector(productsSel));
      Assert.That(products.First().Text, Does.Contain("Soccer Goals $1000"), "First product - is missing.");

      IReadOnlyCollection<IWebElement> menuItems = driver.FindElements(By.CssSelector(menuSelector));
      Assert.That(menuItems.Count, Is.EqualTo(3), "3 instances of active menu item - not found on page."); // 3 responsive elements for different screen sizes.
      //Assert.That(menuItems.Any(item => item.Text.Contains("Soccer")), Is.True, "The 'Soccer' menu item was not found.");
    }
  }
}
