using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.Infrastructure;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api")]
  public class AdminLoginController: ShopController
  {
    private SignInManager<AppUser> _signInManager;
    private UserManager<AppUser> _userManager;

    private IConfiguration _config;

    public AdminLoginController(
      ICartLineRepository rRepo,
      IGuestRepository gRepo,
      IInStockRepository pRepo,
      IConfiguration c,
      UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager
    ): base(rRepo, gRepo, pRepo)
    {
      _config = c;
      _userManager = userManager;
      _signInManager = signInManager;
    }

    [HttpPost("admin-login")] // POST /api/admin-login.  Accepts application/json POST submissions containing stringified JSON data in request body.
    public async Task<IActionResult> AdminLogin([FromBody] AdminLoginSubmitDTO adminLoginSubmitDTO)
    {
      if (!ModelState.IsValid) { return BadRequest(ModelState); }
      Guest guest = EnsureGuestIdFromCookie();
      Nullable<Guid> guestId = guest.ID;
      UserType userType = UserType.Guest;

      string vipUserName = _config.GetSection("Authentication:VIP:UserName").Value;
      string vipPassword = _config.GetSection("Authentication:VIP:Password").Value;

      AppUser? appUser;
      if( !(adminLoginSubmitDTO.username.Equals(vipUserName) && adminLoginSubmitDTO.password.Equals(vipPassword)) ){
        return this.StatusCode(StatusCodes.Status401Unauthorized, "Incorrect username or password");
      }
      else
      {
        // Login as VIP user
        string vipUserId = _config.GetSection("Authentication:VIP:Id").Value;
        appUser = await _userManager.FindByIdAsync(vipUserId);

        if (appUser == null){
          return this.StatusCode(StatusCodes.Status500InternalServerError, "Could not find user record.");
        }

        try
        {
          userType = UserType.AppUser;

          var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
          identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, vipUserId));
          identity.AddClaim(new Claim(ClaimTypes.Name, vipUserName));

          bool persistAfterBrowserClose = false;
          bool lockoutOnFailure = false;
          var result = await _signInManager.PasswordSignInAsync(appUser, vipPassword, persistAfterBrowserClose, lockoutOnFailure);

          if (result.Succeeded)
          {
            guest = null;
            guestId = null;
            return Ok(new { loginResult = "Success", loginType = "VIP AppUser" });
          }
          if (result.RequiresTwoFactor){
            return this.StatusCode(StatusCodes.Status202Accepted, "Redirect the user to complete two-factor authentication");
          }
          if (result.IsLockedOut){
            return this.StatusCode(StatusCodes.Status423Locked, "User account is locked out");
          }
          else{
            return this.StatusCode(StatusCodes.Status400BadRequest, "Invalid login attempt");
          }
        }
        catch (Exception ex)
        {
          return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
      }
    }
  }
}
