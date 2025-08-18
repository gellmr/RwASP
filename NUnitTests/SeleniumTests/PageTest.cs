using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace NUnitTests.SeleniumTests
{
  [TestFixture]
  public class PageTest
  {
    // Declare a variable for the IWebDriver instance.
    protected IWebDriver driver;

    // The URL of the Vite front-end, which is managed by the ViteTestFixture.
    protected const string viteUrl = "https://localhost:5173";

    // The [SetUp] attribute runs before each individual test method.
    [SetUp]
    protected void Setup()
    {
      // Set up the ChromeDriver. This line launches a new Chrome browser window.
      driver = new ChromeDriver();
      driver.Manage().Window.Maximize();
    }

    // The [TearDown] attribute runs after each test method to clean up resources.
    [TearDown]
    protected void TearDown()
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
