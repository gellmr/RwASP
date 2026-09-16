using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class AdminBacklogTests : AdminTest
  {
    public string? pagLink2Css = "a[href=\"/admin/orders/2\"]";
    public string? backLogRowCss = "tr.backlogCursorRow";

    //[Test]
    //public void BacklogPage_Search_OrderPlaced()
    //{
    //  // Date parsing behavior needs work.
    //  GoToBackLog();
    //  const string searchCss = "input[placeholder='Search backlog']";
    //  try
    //  {
    //    var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
    //    // Enter a search string to see if the OrderPlaced column is searchable.
    //    IWebElement searchElement = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(searchCss)));
    //    searchElement.SendKeys("18/09/2025");
    //    // Should see 3 results
    //    // 18/09/2025 7:49:35 PM +08:00  109 user111  392943d5...            User  user-111@gmail.com 0.00  15.00   1 Thinking Cap  OrderPlaced
    //    // 18/09/2025 6:07:37 PM +08:00  108 John Doe            D7AC05A9... Guest john@example.com   0.00  100.00  1 Life Jacket OrderPlaced
    //    // 18/09/2025 6:00:44 PM +08:00  107 John Doe            D7AC05A9... Guest john@example.com   0.00  90.00   1 Chess Pieces - Full Set OrderPlaced
    //  }
    //  catch (WebDriverTimeoutException){
    //    Assert.Fail("BacklogPage_SearchByOrderPlaced - Timeout occurred");
    //  }
    //}

    [Test]
    public void BacklogPage_PaginationShouldWork()
    {
      GoToBackLog();
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(15));

        By elementsLocator = By.CssSelector(backLogRowCss);
        IList<IWebElement> allElements = wait.Until(ExpectedConditions.VisibilityOfAllElementsLocatedBy(elementsLocator));
        Assert.That(allElements.Count, Is.EqualTo(12), "BacklogPage_PaginationShouldWork - Page 1 does not have 12 rows");

        // Grab the first row's "#Result" column text (which should be "1")
        IWebElement firstRowResultCol = allElements.First().FindElement(By.CssSelector("td:first-child"));
        string firstRowResult = firstRowResultCol.Text.Trim();
        Assert.That(firstRowResult, Is.EqualTo("1"), "BacklogPage_PaginationShouldWork - Page 1 does not start with Result #1");

        // Grab all Order IDs on Page 1 to ensure they don't overlap with Page 2
        var page1OrderIds = allElements.Select(r => r.GetAttribute("data-orderid")).ToList();

        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.CssSelector(pagLink2Css)));
        clickableButton.Click();

        // Wait explicitly for the first row's Result # to change to "13", proving React has finished rendering Page 2
        wait.Until(driver => {
            var rows = driver.FindElements(elementsLocator);
            if (rows.Count == 0) return false;
            return rows.First().FindElement(By.CssSelector("td:first-child")).Text.Trim() == "13";
        });

        allElements = wait.Until(ExpectedConditions.VisibilityOfAllElementsLocatedBy(elementsLocator));
        Assert.That(allElements.Count, Is.EqualTo(12), "BacklogPage_PaginationShouldWork - Page 2 does not have 12 rows");

        var page2OrderIds = allElements.Select(r => r.GetAttribute("data-orderid")).ToList();

        // Ensure no overlap between pages
        var intersection = page1OrderIds.Intersect(page2OrderIds);
        Assert.That(intersection.Count(), Is.EqualTo(0), "BacklogPage_PaginationShouldWork - Page 1 and Page 2 contain overlapping orders!");
      }
      catch (WebDriverTimeoutException){
        Assert.Fail("BacklogPage_PaginationShouldWork - Timeout occurred");
      }
    }

    public void GoToBackLog()
    {
      driver.Navigate().GoToUrl(viteUrl);
      GoToLoginPage();
      LoginAsVip();
    }
  }
}
