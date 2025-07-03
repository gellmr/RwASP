using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.Domain.Abstract;

using Google.Apis.Auth;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api")]
  public class GoogleTokenValidateController : ShopController
  {
    protected IAppUserRepo appUserRepo;
    private readonly string? _clientId;

    public GoogleTokenValidateController(IConfiguration config, ICartLineRepository rRepo, IGuestRepository gRepo, IInStockRepository pRepo, IAppUserRepo aRepo) : base(rRepo, gRepo, pRepo) {
      _clientId = config.GetSection("Authentication:Google:ClientId").Value;
      appUserRepo = aRepo;
    }

    [HttpPost("validate-google-token")] // POST /api/validate-google-token.  Accepts application/json POST submissions containing stringified JSON data in request body.
    public async Task<IActionResult> ValidateGoogleToken([FromBody] ConfirmGoogleAuthDTO tokenDTO)
    {
      // This action will be hit after Google authentication is complete.
      if (!ModelState.IsValid) { return BadRequest(ModelState); }
      Guest? guest = EnsureGuestIdFromCookie();
      Nullable<Guid> guestId = guest.ID;
      UserType userType = UserType.Guest;

      // Exchange the authorization code (tokenDTO.credential) for an access token (payload)
      GoogleJsonWebSignature.Payload? payload = await ValidateTokenAsync(tokenDTO);
      if (payload != null)
      {
        // We can now use the access token (payload) to make API calls to Google, on the users behalf.

        // Token is valid, extract user information
        GoogleAppUserDTO googleAppUser = new GoogleAppUserDTO
        {
          Subject = payload.Subject, // This is the unique Google user ID. String about 21 characters long.
          Email = payload.Email,
          GivenName = payload.GivenName,
          FamilyName = payload.FamilyName,
        };

        // We can now log the user in, and create an AppUser object, and set the UserType to GoogleAppUser
        // Save to database
        AppUser? appUser = await appUserRepo.SaveGoogleAppUser(googleAppUser);
        userType = UserType.GoogleAppUser;
        //SaveAppUserToCookie(appUser); // TODO - use _userManager and _signInManager.
        guest = null;
        guestId = null;

        // Update the client so they can see they are logged in
        // They will now have access to the restricted pages.
        return Ok( new { loginResult = "Success validating Google Login token.", loginType = "Google Sign In" }); // Automatically cast object to JSON.
      }else{
        return BadRequest( new { loginResult = "Could not validate Google Login token." });
      }
    }

    private async Task<GoogleJsonWebSignature.Payload?> ValidateTokenAsync(ConfirmGoogleAuthDTO tokenDTO)
    {
      try
      {
        GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings() {
          Audience = new List<string> { _clientId }
        };
        // The SignedToken() method within expects signedToken.Split('.') to produce 3 parts.
        // (Header, Payload, Signature) ...It throws if they are not found.
        string signedToken = tokenDTO.credential;
        GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(signedToken, settings);
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