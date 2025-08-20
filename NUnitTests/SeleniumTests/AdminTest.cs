using NUnitTests.Helpers;
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

    public const string? custAccsNavBtnCss = "#adminLayout .navbar-collapse a[href=\"/admin/useraccounts\"]";
    public const string? custAccsPageTitleCss = ".adminCont h4.adminTitleBar";

    public List<IWebElement> customerAccountLines;
    public const string? customerAccountLinesCss = ".adminUserAccRow";
    public string? customerAccountLineResultText = null; // Not const. Gets set later

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
        GetBacklogRow1Text();
      }
      catch (WebDriverTimeoutException)
      {
        Assert.Fail(pageOrElementMissing);
      }
      // Backlog page should have appeared.
      if (backlogTitle == null) { Assert.Fail("Failed to reach backlog page."); return; }
      Assert.That(backlogTitle.Text, Does.Contain("Orders Backlog"), "LoginAsVip - backlog page title is incorrect.");
    }

    public void GoToCustomerAccounts()
    {
      IWebElement? pageTitle = null;
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        IWebElement custAccsNavBtn = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(custAccsNavBtnCss)));
        IWebElement clickableButton = wait.Until(ExpectedConditions.ElementToBeClickable(custAccsNavBtn));
        clickableButton.Click();

        // Wait for backlog page to appear
        pageTitle = wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(custAccsPageTitleCss)));
      }
      catch (WebDriverTimeoutException ex)
      {
        Assert.Fail("Timeout during GoToCustomerAccounts");
      }
      if (pageTitle == null) { Assert.Fail("Failed to reach customer accounts page."); return; }
      Assert.That(pageTitle.Text, Does.Contain("Customer Accounts"), "Customer accounts - page title is incorrect.");
    }

    public void GetCustomerAccountLines()
    {
      try{
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector(customerAccountLinesCss)));
        IReadOnlyCollection<IWebElement> accRows = driver.FindElements(By.CssSelector(customerAccountLinesCss));
        customerAccountLines = accRows.ToList();
      }
      catch (WebDriverTimeoutException ex){
        Assert.Fail("ShouldSee_Admin - Timeout occurred");
      }
    }

    public void ShouldSee_Admin_CustomerAccountLine()
    {
      IWebElement? row = null;
      try
      {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(3));
        GetCustomerAccountLines();
        row = customerAccountLines[0]; // Get the first row
        customerAccountLineResultText = TestHelpers.TrimAndFlattenString(row.Text);
      }
      catch (WebDriverTimeoutException ex)
      {
        Assert.Fail("ShouldSee_Admin - Timeout occurred");
      }
      if (row == null) { Assert.Fail("ShouldSee_Admin - Administrator row not found"); return; }
      string? expectedText1 = "(Logged in as) Administrator User ID";
      string? expectedText2 = "Phone 04 1234 4321 Email user-111@gmail.com Account Type User Edit Account View Orders";
      Assert.That(customerAccountLineResultText, Does.Contain(expectedText1), "ShouldSee_Admin - Administrator row text is incorrect.");
      Assert.That(customerAccountLineResultText, Does.Contain(expectedText2), "ShouldSee_Admin - Administrator row text is incorrect.");
    }
  }
}
