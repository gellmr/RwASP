using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.Domain.Abstract;

using Google.Apis.Auth;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api")]
  public class GoogleTokenValidateController : ShopController
  {
    private readonly string? _clientId;
    private readonly string? _clientSecret;

    public GoogleTokenValidateController(IConfiguration config, ICartLineRepository rRepo, IGuestRepository gRepo, IInStockRepository pRepo) : base(rRepo, gRepo, pRepo) {
      _clientId = config.GetSection("Authentication:Google:ClientId").Value;
      _clientSecret = config.GetSection("Authentication:Google:ClientSecret").Value;
    }

    [HttpPost("validate-google-token")] // POST /api/validate-google-token.  Accepts application/json POST submissions containing stringified JSON data in request body.
    public async Task<IActionResult> ValidateGoogleToken([FromBody] ConfirmGoogleAuthDTO tokenDTO)
    {
      // This action will be hit after Google authentication is complete.
      if (!ModelState.IsValid) { return BadRequest(ModelState); }
      Guest guest = EnsureGuestIdFromCookie();
      Nullable<Guid> guestId = guest.ID;
      UserType userType = UserType.Guest;

      GoogleJsonWebSignature.Payload? payload = await ValidateTokenAsync(tokenDTO);
      if (payload != null){
        return Ok( new { resultMsg = "Success validating Google Login token." }); // Automatically cast object to JSON.
      }else{
        return BadRequest( new { resultMsg = "Could not validate Google Login token." });
      }
    }

    private async Task<GoogleJsonWebSignature.Payload?> ValidateTokenAsync(ConfirmGoogleAuthDTO tokenDTO)
    {
      try
      {
        string accessToken = tokenDTO.access_token;
        GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings() {
          Audience = new List<string> { _clientId }
        };
        // Throws if we pass Access Token instead of JWT ID Token
        GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(accessToken, settings);
        return payload;
      }
      catch (InvalidJwtException)
      { 
        return null; // Token is not a valid JWT or has expired
      }
      catch (Exception)
      {
        return null; // Handle other exceptions
      }
    }
  }
}