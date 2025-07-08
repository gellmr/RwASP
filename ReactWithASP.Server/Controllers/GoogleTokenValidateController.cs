using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.Domain.Abstract;

using Google.Apis.Auth;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api")]
  public class GoogleTokenValidateController : LoginController
  {
    private readonly string? _clientId;

    public GoogleTokenValidateController(
      ICartLineRepository cartRepo,
      IGuestRepository guestRepo,
      IInStockRepository inStockRepo,
      IConfiguration config,
      UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager
    ) : base(cartRepo, guestRepo, inStockRepo, config, userManager, signInManager)
    {
      _clientId = config.GetSection("Authentication:Google:ClientId").Value;
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
      if(payload == null){
        return BadRequest(new { loginResult = "Could not validate Google Login token." });
      }

      // The payload has a value... We can now use the access token (payload) to make API calls to Google, on the users behalf.
      // Now that we already have the access token (payload) we dont need to use ExternalLoginInfo or GetExternalLoginInfoAsync

      IdentityResult createResult;
      AppUser? appUser;
      bool persistAfterBrowserClose = false;

      // Token is valid, extract user information
      GoogleAppUserDTO googleAppUser = new GoogleAppUserDTO
      {
        Subject = payload.Subject, // This is the unique Google user ID. String about 21 characters long.
        Email = payload.Email,
        GivenName = payload.GivenName,
        FamilyName = payload.FamilyName,
      };

      appUser = await _userManager.FindByIdAsync(googleAppUser.Subject); // See if the user already exists in our database...
      if (appUser == null)
      {
        // There is no database record yet, for this GoogleSignIn user. Create new AppUser record in database...
        appUser = new AppUser{
          EmailConfirmed = true, // The user cannot sign in unless this is true.
          AccessFailedCount = 0,
          LockoutEnabled = false,
          TwoFactorEnabled = false,
          UserName = googleAppUser.GivenName + "-" + googleAppUser.FamilyName,
          Email = googleAppUser.Email,
          Id = googleAppUser.Subject,
        };

        createResult = await _userManager.CreateAsync(appUser);

        if (!createResult.Succeeded){
          return this.StatusCode(StatusCodes.Status400BadRequest, "Could not create AppUser record in our database for this GoogleSignIn.");
        }
        // Success creating AppUser...
      }
      // AppUser record exists in our database...

      // User successfully signed in.
      await _signInManager.SignInAsync(appUser, isPersistent: persistAfterBrowserClose); // isPersistent: false means the cookie is session-based
      guest = null;
      guestId = null;
      userType = UserType.GoogleAppUser;
      return Ok(new { loginResult = "Success validating Google Login token.", loginType = "Google Sign In" });
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