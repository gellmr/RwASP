using NUnit.Framework;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;

namespace SeleniumTests
{
  [TestFixture]
  public class HelloWorld
  {
    private IWebDriver driver;

    [SetUp]
    public void Setup()
    {
      driver = new ChromeDriver();
      driver.Manage().Window.Maximize();
    }

    [Test]
    public void SearchForSelenium_TitleIsCorrect()
    {
      // Arrange
      string searchKeyword = "Selenium";
      string expectedTitle = "Selenium - Google Search";

      // Act
      // Navigate to Google's homepage.
      driver.Navigate().GoToUrl("https://www.google.com");

      // Find the search box element by its name attribute and type the keyword.
      IWebElement searchBox = driver.FindElement(By.Name("q"));
      searchBox.SendKeys(searchKeyword);
      searchBox.Submit(); // This submits the search query.

      // Wait for a moment to ensure the new page loads.
      System.Threading.Thread.Sleep(2000);

      // Assert
      // Verify the page title.
      Assert.That(driver.Title, Is.EqualTo(expectedTitle), "The page title is not what was expected.");
    }

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
