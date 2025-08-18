
using System.Diagnostics;

namespace NUnitTests.Helpers
{
  public static class TestHelpers
  {
    public static async Task WaitForServer(string url)
    {
      using (var client = new HttpClient())
      {
        var retries = 0;
        const int maxRetries = 10;
        const int delayMs = 725;

        while (retries < maxRetries)
        {
          try
          {
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            Console.WriteLine("Vite server is ready!");
            return; // Success
          }
          catch (HttpRequestException)
          {
            Console.WriteLine($"Waiting for Vite server... Attempt {retries + 1}");
            await Task.Delay(delayMs);
            retries++;
          }
        }
        throw new Exception("Timed out waiting for (" + url + ") server to start.");
      }
    }

    // A helper method to find and terminate existing server processes.
    public static void TerminateExistingProcesses()
    {
      Int32 defWait = 1000;
      TerminateProcess("dotnet", defWait); // Find and kill existing .NET processes.
      TerminateProcess("node", defWait);   // Find and kill existing Node.js processes (Vite runs on node).
    }
    private static void TerminateProcess(string? name, Int32 waitForExit){
      foreach (var process in Process.GetProcessesByName(name)){
        try{
          process.Kill(true);
          process.WaitForExit(waitForExit); // Wait this many milliseconds for the process to exit.
        }
        catch (Exception ex){
          Console.WriteLine($"Could not terminate (" + name + ") process: { ex.Message}");
        }
      }
    }
  }
}
