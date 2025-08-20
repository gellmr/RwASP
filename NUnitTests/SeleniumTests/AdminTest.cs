

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class AdminTest : ShopTest
  {

    public void GoToLoginPage()
    {
      driver.Navigate().GoToUrl(viteUrl + "/admin");

      // Wait for login elements to be visible

      // Populate login fields

      // Click login button

      // Wait for backlog page to appear

      // Login page should have appeared.
    }

    public void LoginAsVip()
    {
    }
  }
}
