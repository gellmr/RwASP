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
    public const string backlogTitleCss = "#adminLayout h4.adminTitleBar";

    public string? vipUsername;
    public string? vipPassword;

    public AdminTest(){
      try{
        vipUsername = TestConfiguration.Config.GetSection("Authentication:VIP:UserName").Value;
        vipPassword = TestConfiguration.Config.GetSection("Authentication:VIP:Password").Value;
      }
      catch (Exception ex){
        throw; // Configuration not available
      }
    }

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
      IWebElement? usernameField = null;
      IWebElement? passwordField = null;
      IWebElement? backlogTitle = null;
      try
      {
        // Populate login fields
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        usernameField = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(loginUsernameFieldCss)));
        usernameField.SendKeys(vipUsername);

        passwordField = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(loginPasswordFieldCss)));
        passwordField.SendKeys(vipPassword);

        // Click login button
        IWebElement submitBtn = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(loginSubmitCss)));
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(submitBtn));
        clickableButton.Click();

        // Wait for backlog page to appear
        backlogTitle = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(backlogTitleCss)));
      }
      catch (WebDriverTimeoutException)
      {
        Assert.Fail(pageOrElementMissing);
      }
      // Backlog page should have appeared.
      if (backlogTitle == null) { Assert.Fail("Failed to reach backlog page."); return; }
      Assert.That(backlogTitle.Text, Does.Contain("Orders Backlog"), "LoginAsVip - backlog page title is incorrect.");
    }
  }
}
