using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using SeleniumExtras.WaitHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  internal class HomePageSearch : PageTest
  {
    [Test]
    public void TypeSearch_BringsProductResults()
    {
      driver.Navigate().GoToUrl(viteUrl);
      const string searchCss = "input[placeholder='Search for products']";
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        IWebElement searchElement = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(searchCss)));
        searchElement.SendKeys("fla");
        IReadOnlyCollection<IWebElement> products = driver.FindElements(By.CssSelector(".productDetails"));
        List<IWebElement> prods = products.ToList();
        IWebElement product1 = prods[0];
        IWebElement product2 = prods[1];
        Assert.That(product1.Text, Does.Contain("Soccer Stadium $80000"), "First product - is missing.");
        Assert.That(product2.Text, Does.Contain("Corner Flags $25"), "Second product - is missing.");
      }
      catch (WebDriverTimeoutException)
      {
        Assert.Fail("Timed out waiting for elements or page navigation.");
      }
    }
  }
}

