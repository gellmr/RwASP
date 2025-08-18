using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using SeleniumExtras.WaitHelpers;

namespace NUnitTests.SeleniumTests
{
  // The [TestFixture] attribute denotes a class that contains test methods.
  // This test will automatically use the [SetUpFixture] to start the servers
  // before any of its tests are executed.
  [TestFixture]
  public class HomepageTests
  {
    // Declare a variable for the IWebDriver instance.
    private IWebDriver driver;

    // The URL of the Vite front-end, which is managed by the ViteTestFixture.
    private const string viteUrl = "https://localhost:5173";

    // The [SetUp] attribute runs before each individual test method.
    [SetUp]
    public void Setup()
    {
      // Set up the ChromeDriver. This line launches a new Chrome browser window.
      driver = new ChromeDriver();
      driver.Manage().Window.Maximize();
    }

    // The [Test] attribute identifies a test method.
    // This test assumes the servers are already running, thanks to the [SetUpFixture].
    [Test]
    public void HomePage_LoadsSuccessfully()
    {
      // Arrange & Act
      // Navigate to the application's localhost URL.
      driver.Navigate().GoToUrl(viteUrl);
      try{
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(12));
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("a.storeBrand"))); // Wait for the heading to be present and visible on the page.
      }catch (WebDriverTimeoutException){
        Assert.Fail("The application page did not load correctly or the heading was not found.");
      }
      Assert.That(driver.Title, Does.Contain("Shop"), "Home page title is incorrect.");
      IWebElement heading = driver.FindElement(By.CssSelector("a.storeBrand"));
      Assert.That(heading.Text, Is.EqualTo("SPORTS STORE"), "Heading text is incorrect.");
    }

    // The [TearDown] attribute runs after each test method to clean up resources.
    [TearDown]
    public void TearDown()
    {
      if (driver != null)
      {
        // The Quit() method closes all browser windows and disposes of the WebDriver instance.
        driver.Quit();
        driver.Dispose();
      }
    }
  }
}
