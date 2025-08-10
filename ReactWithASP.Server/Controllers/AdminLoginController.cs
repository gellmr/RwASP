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
  public class AdminLoginController: LoginController
  {
    public AdminLoginController(
      ICartLineRepository cartRepo,
      IGuestRepository guestRepo,
      IInStockRepository inStockRepo,
      IConfiguration config,
      UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager
    ): base(cartRepo, guestRepo, inStockRepo, config, userManager, signInManager){}

    [HttpGet("guest")] // GET /api/guest
    public ActionResult FetchGuest()
    {  
      try{
        Guest guest = EnsureGuestFromCookieAndDb(null);
        return Ok( new {
          id = guest.ID,
          fullname = guest.FullName,
          firstname = guest.FirstName,
          lastname = guest.LastName,
        });
      }
      catch (Exception ex){
        return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
      }
    }

    [HttpPost("admin-logout")] // POST /api/admin-logout
    public async Task<IActionResult> AdminLogout()
    {
      try{
        await _signInManager.SignOutAsync();
        return this.StatusCode(StatusCodes.Status200OK, "Successfully logged out");
      }
      catch(Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
      }
    }

    [HttpPost("admin-login")] // POST /api/admin-login.  Accepts application/json POST submissions containing stringified JSON data in request body.
    public async Task<IActionResult> AdminLogin([FromBody] AdminLoginSubmitDTO adminLoginSubmitDTO)
    {
      if (!ModelState.IsValid) { return BadRequest(ModelState); }
      Guest guest = EnsureGuestFromCookieAndDb(null);
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
            DeleteGuestCookie(); // Remove the Guest cookie, indicating that we are logged in.
            return Ok(new {
              loginResult = "Success",
              loginType = "User",
              appUserId = appUser.Id,
              fullname = appUser.FullName,
              firstname = AppUser.GetFirstName( appUser.FullName),
              lastname  = AppUser.GetLastName(  appUser.FullName),
            });
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
