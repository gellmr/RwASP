using Microsoft.AspNet.Identity;
using ReactWithASP.Server.DTO.RandomUserme;
using System.Collections.Generic;
using System.Text.Json;

namespace ReactWithASP.Server.Infrastructure
{
  public class RandomUserMeApiClient
  {
    // Fetch a list of generated user data from Random User Generator API. Use seed to ensure same results.  https://randomuser.me/documentation
    public static string BaseAddress = "https://randomuser.me/api/1.4/";

    public static string NumRecords = "&results=44";
    public static string Nationality = "&nat=au";
    public static string Includes = "&inc=gender,name,location,email,phone,picture";
    public static string Excludes = string.Empty;
    public static string GetUsersUri = BaseAddress + "?seed=0AA44gg^^hf*2a^9v" + NumRecords + Nationality + Includes + Excludes;

    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _deserializeOptions;

    // HttpClient is injected by IHttpClientFactory because we registered RandomUserMeApiClient in Program.cs
    public RandomUserMeApiClient(HttpClient httpClient)
    {
      _httpClient = httpClient;
      _deserializeOptions = new JsonSerializerOptions{
        PropertyNameCaseInsensitive = true, // Important for matching JSON (camelCase) to C# (PascalCase)
      };
    }

    // --- GET Request ---
    public async Task<List<UserDTO>?> GetUsersAsync()
    {
      try
      {
        Uri? uri = new Uri(GetUsersUri);
        HttpResponseMessage response = await _httpClient.GetAsync(uri);    // Make the GET request to the API
        response.EnsureSuccessStatusCode();                                // Ensure the request was successful (status code 2xx)
        string jsonResponse = await response.Content.ReadAsStringAsync();  // Read the response content as a string
        ResponseDTO result = JsonSerializer.Deserialize<ResponseDTO>(jsonResponse, _deserializeOptions); // Deserialize the JSON string into objects

        // Discard timezone information (randomuser.me does not generate good timezone data)
        foreach (UserDTO u in result.Results){
          u.Location.TimeZone = null;
        }

        // Remove duplicate thumbnail images
        List<UserDTO> distinctUsers = result.Results
            .GroupBy(user => user.Picture.Thumbnail) // Group users by their Picture property
            .Select(group => group.First())          // From each group, take only the first user encountered
            .Take(40)                                // Take the first 40 distinct users (based on picture)
            .ToList();

        return distinctUsers;
      }
      catch (HttpRequestException ex)
      {
        Console.WriteLine($"Request error: {ex.Message}"); // Handle HTTP-specific errors (e.g., network issues, DNS problems)
        return null;
      }
      catch (JsonException ex)
      {
        Console.WriteLine($"JSON deserialization error: {ex.Message}"); // Handle JSON deserialization errors
        return null;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"An unexpected error occurred: {ex.Message}"); // Catch any other unexpected errors
        return null;
      }
    }
  }
}