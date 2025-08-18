using NUnit.Framework;
using NUnitTests.Helpers;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System;
using System.Diagnostics;
using System.Net.Http;
using System.Threading.Tasks;


namespace SeleniumTests
{

  // This class is responsible for managing the lifecycle of both the Vite client and the .NET Core backend.
  // It uses the [SetUpFixture] attribute to run setup/teardown once for the entire test assembly.
  [SetUpFixture]
  public class ViteTestFixture
  {
    //private IWebDriver driver;

    private Process backendProcess; // Process for the .NET Core backend server.
    private Process viteProcess;    // Process for the Vite front-end server.

    private const string? vitePort = "5173";
    private const string? dotNetPort = "7225";

    private const string viteUrl = "https://localhost:" + vitePort;   //  Vite SPA proxy
    private const string backendUrl = "https://localhost:" + dotNetPort; // .NET Core backend server

    // This method runs once before any tests in the assembly.
    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
      Console.WriteLine("Terminating any existing server processes...");
      TerminateExistingProcesses();

      Console.WriteLine("Starting .NET Core backend server...");
      // Use 'dotnet run' to start the backend.
      backendProcess = new Process
      {
        StartInfo = new ProcessStartInfo
        {
          FileName = "dotnet",
          Arguments = "run",
          // *** IMPORTANT: You must ensure this path is correct. ***
          WorkingDirectory = "C:\\Users\\Michael Gell\\source\\repos\\RwASP\\ReactWithASP.Server",
          RedirectStandardOutput = true,
          RedirectStandardError = true,
          UseShellExecute = false,
          CreateNoWindow = true
        }
      };

      // Hook up event handlers to capture and log the output. This is the key to debugging!
      backendProcess.OutputDataReceived += (sender, e) => Console.WriteLine($"[Backend]: {e.Data}");
      backendProcess.ErrorDataReceived += (sender, e) => Console.WriteLine($"[Backend Error]: {e.Data}");

      backendProcess.Start();
      backendProcess.BeginOutputReadLine();
      backendProcess.BeginErrorReadLine();

      // Wait for the backend to be ready before starting the frontend.
      await WaitForServerReady(backendUrl);

      Console.WriteLine("Starting Vite front-end server...");
      // Start the Vite development server using `npm run dev`.
      viteProcess = new Process
      {
        StartInfo = new ProcessStartInfo
        {
          FileName = "npm",
          Arguments = "run dev",
          // *** IMPORTANT: Adjust this path to the root of your SPA project. ***
          WorkingDirectory = "../reactwithasp.client",
          RedirectStandardOutput = true,
          RedirectStandardError = true,
          UseShellExecute = false,
          CreateNoWindow = true
        }
      };

      // Hook up event handlers for the Vite process as well.
      viteProcess.OutputDataReceived += (sender, e) => Console.WriteLine($"[Frontend]: {e.Data}");
      viteProcess.ErrorDataReceived += (sender, e) => Console.WriteLine($"[Frontend Error]: {e.Data}");

      viteProcess.Start();
      viteProcess.BeginOutputReadLine();
      viteProcess.BeginErrorReadLine();

      // Wait for the Vite server to be ready.
      await WaitForServerReady(viteUrl);

      Console.WriteLine("Both servers are ready. Tests can now begin.");
    }

    // This method runs once after all tests in the assembly have completed.
    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
      Console.WriteLine("Stopping servers...");

      // Gracefully kill the Vite process if it's still running.
      if (viteProcess != null && !viteProcess.HasExited)
      {
        try { viteProcess.Kill(true); viteProcess.Dispose(); } catch { }
      }

      // Gracefully kill the backend process if it's still running.
      if (backendProcess != null && !backendProcess.HasExited)
      {
        try { backendProcess.Kill(true); backendProcess.Dispose(); } catch { }
      }

      Console.WriteLine("Servers have been shut down.");
    }

    // A helper method to find and terminate existing server processes.
    private void TerminateExistingProcesses()
    {
      // Find and kill existing .NET processes.
      foreach (var process in Process.GetProcessesByName("dotnet"))
      {
        try { process.Kill(true); process.WaitForExit(5000); } catch { }
      }
      // Find and kill existing Node.js processes (Vite runs on node).
      foreach (var process in Process.GetProcessesByName("node"))
      {
        try { process.Kill(true); process.WaitForExit(5000); } catch { }
      }
    }

    // This is a helper method to wait for a server to be ready.
    private async Task WaitForServerReady(string url)
    {
      using (var client = new HttpClient())
      {
        const int maxRetries = 30; // 30 seconds timeout
        const int delayMs = 1000;  // 1 second delay

        for (int i = 0; i < maxRetries; i++)
        {
          try
          {
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            Console.WriteLine($"Server at {url} is ready!");
            return; // Success!
          }
          catch (HttpRequestException)
          {
            Console.WriteLine($"Waiting for server at {url}... Attempt {i + 1}");
            await Task.Delay(delayMs);
          }
        }
        throw new TimeoutException($"Timed out waiting for server at {url} to start.");
      }
    }
  }
}