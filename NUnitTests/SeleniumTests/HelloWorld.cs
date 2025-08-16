using NUnit.Framework;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;

namespace SeleniumTests
{
  [TestFixture]
  public class HelloWorld
  {
    private IWebDriver driver;

    // This variable holds the URL of your local application.
    private const string appUrl = "https://localhost:5173";

    [SetUp]
    public void Setup()
    {
      driver = new ChromeDriver();
      driver.Manage().Window.Maximize();

      // Navigate to the application localhost URL.
      driver.Navigate().GoToUrl(appUrl);
    }

    [Test]
    public void HomePage_LoadsSuccessfully_AndTitleIsCorrect()
    {
      System.Threading.Thread.Sleep(2000);

      Assert.That(driver.Title, Does.Contain("Shop"), "Home page title - incorrect.");

      IWebElement heading = driver.FindElement(By.CssSelector("a.storeBrand"));

      Assert.That(heading.Text, Is.EqualTo("SPORTS STORE"), "Heading text - incorrect.");
    }

    // Runs after each test method to clean up resources.
    [TearDown]
    public void TearDown()
    {
      if (driver != null){
        driver.Quit(); // Close all browser windows and terminate the driver process
        driver.Dispose();
      }
    }
  }
}
