
namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class AdminCustAccountsTest : AdminTest
  {
    [Test]
    public void LoginAsVip_ShouldSeeAdmin()
    {
      driver.Navigate().GoToUrl(viteUrl);
      GoToLoginPage();
      LoginAsVip();
      GoToCustomerAccounts();
      ShouldSee_Admin_CustomerAccountLine(); // Should see Administrator as first row
    }
  }
}
