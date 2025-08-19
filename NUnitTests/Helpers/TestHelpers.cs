
namespace NUnitTests.Helpers
{
  public static class TestHelpers
  {
    public static string TrimAndFlattenString(string input)
    {
      if (string.IsNullOrEmpty(input))
      {
        return input;
      }

      // Replace all newline characters with a single space
      string noNewlines = input.Replace("\r\n", " ")
                               .Replace("\n", " ")
                               .Replace("\r", " ");

      // Replace multiple spaces with a single space
      // This uses a loop to handle cases where there might be more than two spaces
      while (noNewlines.Contains("  ")) // Two spaces
      {
        noNewlines = noNewlines.Replace("  ", " ");
      }

      // Trim leading and trailing whitespace
      return noNewlines.Trim();
    }
  }
}
