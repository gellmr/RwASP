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

    [Test]
    public void BacklogPage_PaginationShouldWork()
    {
      GoToBackLog();
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));

        By elementsLocator = By.CssSelector(backLogRowCss);
        IList<IWebElement> allElements = wait.Until(ExpectedConditions.VisibilityOfAllElementsLocatedBy(elementsLocator));
        IWebElement firstRow = allElements.First();
        IWebElement lastRow = allElements.Last();
        string firstRowOrderId = firstRow.GetAttribute("data-orderid");
        string lastRowOrderId = lastRow.GetAttribute("data-orderid");
        Int32 firstId = Int32.Parse(firstRowOrderId);
        Int32 lastId = Int32.Parse(lastRowOrderId);
        Int32 delta = firstId - lastId;
        Assert.That(delta, Is.EqualTo(11), "BacklogPage_PaginationShouldWork - Unexpected OrderID values (1 of 2)");
        Int32 previous = lastId;

        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(By.CssSelector(pagLink2Css)));
        clickableButton.Click();

        allElements = wait.Until(ExpectedConditions.VisibilityOfAllElementsLocatedBy(elementsLocator));
        firstRow = allElements.First();
        lastRow = allElements.Last();
        firstRowOrderId = firstRow.GetAttribute("data-orderid");
        lastRowOrderId = lastRow.GetAttribute("data-orderid");
        Int32 _firstId = Int32.Parse(firstRowOrderId);
        Int32 _lastId = Int32.Parse(lastRowOrderId);
        Int32 _delta = _firstId - _lastId;
        Assert.That((_firstId + 1), Is.EqualTo(previous), "BacklogPage_PaginationShouldWork - OrderID values do not continue to next page");
        Assert.That(_delta, Is.EqualTo(11), "BacklogPage_PaginationShouldWork - OrderID values are not continuous (2 of 2)");
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
