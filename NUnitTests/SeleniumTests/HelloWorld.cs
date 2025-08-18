using NUnit.Framework;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using NUnitTests.Helpers;
using System.Diagnostics;

namespace SeleniumTests
{
  [TestFixture]
  public class HelloWorld
  {
    private IWebDriver driver;

    private Process backendProcess; // Process for the .NET Core backend server.
    private Process viteProcess;    // Process for the Vite front-end server.

    private const string? vitePort   = "5173";
    private const string? dotNetPort = "7225";

    private const string viteUrl    = "https://localhost:" + vitePort;   //  Vite SPA proxy
    private const string backendUrl = "https://localhost:" + dotNetPort; // .NET Core backend server

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
      TestHelpers.TerminateExistingProcesses();

      Console.WriteLine("Starting .NET Core backend server...");
      backendProcess = new Process{
        StartInfo = new ProcessStartInfo{
          FileName = "dotnet",
          Arguments = "run",
          WorkingDirectory = "C:\\Users\\Michael Gell\\source\\repos\\RwASP\\ReactWithASP.Server", // Adjust this path
          RedirectStandardOutput = true,
          RedirectStandardError = true,
          UseShellExecute = false,
          CreateNoWindow = true
        }
      };
      backendProcess.Start();
      await TestHelpers.WaitForServer(backendUrl); // Wait for the backend to be ready before starting the frontend.

      Console.WriteLine("Starting Vite front-end server...");
      viteProcess = new Process{
        StartInfo = new ProcessStartInfo{
          FileName = "npm",
          Arguments = "run dev",
          WorkingDirectory = "../reactwithasp.client", // Adjust this path to the root of your SPA project
          RedirectStandardOutput = true,
          RedirectStandardError = true,
          UseShellExecute = false,
          CreateNoWindow = true
        }
      };
      viteProcess.Start();
      await TestHelpers.WaitForServer(viteUrl);

      Console.WriteLine("Both servers are ready. Tests can now begin.");
    }

    [SetUp]
    public async Task Setup()
    {
      driver = new ChromeDriver();
      await TestHelpers.WaitForServer(viteUrl);
      driver.Navigate().GoToUrl(viteUrl); // Navigate to the application localhost URL.
    }

    // A test to verify the home page loads correctly.
    [Test]
    public void HomePage_LoadsSuccessfully_AndTitleIsCorrect(){
      try{
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(12));
        wait.Until(ExpectedConditions.ElementIsVisible(By.CssSelector("a.storeBrand"))); // Wait for the heading to be present and visible on the page.
      }
      catch (WebDriverTimeoutException){
        Assert.Fail("The application page did not load correctly or the heading was not found.");
      }
      Assert.That(driver.Title, Does.Contain("Shop"), "Home page title is incorrect.");
      IWebElement heading = driver.FindElement(By.CssSelector("a.storeBrand"));
      Assert.That(heading.Text, Is.EqualTo("SPORTS STORE"), "Heading text is incorrect.");
    }

    [TearDown]
    public void TearDown(){
      if (driver != null){
        driver.Quit(); // Close all browser windows and terminate the driver process
        driver.Dispose();
      }
    }

    // This method runs once after all tests in the assembly have completed.
    [OneTimeTearDown]
    public void OneTimeTearDown() {
      Console.WriteLine("Stopping servers...");
      // Kill the Vite process if it's still running.
      if (viteProcess != null && !viteProcess.HasExited){
        viteProcess.Kill();
        viteProcess.Dispose();
      }
      // Kill the backend process if it's still running.
      if (backendProcess != null && !backendProcess.HasExited){
        backendProcess.Kill();
        backendProcess.Dispose();
      }
      Console.WriteLine("Servers have been shut down.");
    }
  }
}
