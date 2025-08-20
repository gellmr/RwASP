using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System.Xml.Linq;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class AdminTest : ShopTest
  {
    public const string adminPageTitleCss = "#loginLayout h4";
    public const string loginUsernameFieldCss = "#formGroupEmail";
    public const string loginPasswordFieldCss = "#formGroupPassword";
    public const string loginSubmitCss = "#loginSubmit";

    public void GoToLoginPage()
    {
      IWebElement? title = null;
      try
      {
        // Wait for login elements to be visible
        driver.Navigate().GoToUrl(viteUrl + "/admin");
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        title = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(adminPageTitleCss)));
      }
      catch (WebDriverTimeoutException)
      {
        Assert.Fail(pageOrElementMissing);
      }
      // Login page should have appeared.
      if (title == null) { Assert.Fail("Failed to reach login page."); return; }
      Assert.That(title.Text, Does.Contain("Admin Login"), "GoToLoginPage - title is incorrect.");
    }

    public void LoginAsVip()
    {
      // Populate login fields
      // Click login button
      // Wait for backlog page to appear
    }
  }
}
