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
      IWebElement? product1 = null;
      IWebElement? product2 = null;
      driver.Navigate().GoToUrl(viteUrl);
      const string searchCss = "input[placeholder='Search for products']";
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        IWebElement searchElement = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(searchCss)));
        searchElement.SendKeys("fla");
        IReadOnlyCollection<IWebElement> products = driver.FindElements(By.CssSelector(".productDetails"));
        List<IWebElement> prods = products.ToList();
        product1 = prods[0];
        product2 = prods[1];
      }
      catch (WebDriverTimeoutException)
      {
        Assert.Fail("Timed out waiting for elements or page navigation.");
      }
      if (product1 == null){ Assert.Fail("BringsProductResults - product1 did not appear."); return; }
      if (product2 == null) { Assert.Fail("BringsProductResults - product2 did not appear."); return; }
      Assert.That(product1.Text, Does.Contain("Soccer Stadium $80000"), "BringsProductResults - First product - is missing.");
      Assert.That(product2.Text, Does.Contain("Corner Flags $25"), "BringsProductResults - Second product - is missing.");
    }
  }
}

