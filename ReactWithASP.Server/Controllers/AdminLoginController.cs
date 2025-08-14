﻿using Microsoft.AspNetCore.Authentication.Cookies;
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
    protected string vipUserId;
    protected string vipUserName;
    protected string vipPassword;

    public AdminLoginController(
      ICartLineRepository cartRepo,
      IGuestRepository guestRepo,
      IInStockRepository inStockRepo,
      IConfiguration config,
      UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager
    ): base(cartRepo, guestRepo, inStockRepo, config, userManager, signInManager)
    {
      vipUserId = _config.GetSection("Authentication:VIP:Id").Value;
      vipUserName = _config.GetSection("Authentication:VIP:UserName").Value;
      vipPassword = _config.GetSection("Authentication:VIP:Password").Value;
    }

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
      try
      {
        if (!ModelState.IsValid){
          return BadRequest(ModelState);
        }
        Guest guest = null;
        Guid? guestId = null;
        guest = EnsureGuestFromCookieAndDb(null); // Touch the cookie to ensure it exists.
        guestId = (guest != null) ? guest.ID : null;
        AppUser ? appUser;
        string? uid = GetLoggedInUserIdFromIdentityCookie(); // See if there is a logged in user.

        bool loginDetailsOk = ( adminLoginSubmitDTO.username.Equals(vipUserName) && adminLoginSubmitDTO.password.Equals(vipPassword) );
        if (!loginDetailsOk){
          return this.StatusCode( StatusCodes.Status401Unauthorized, new{ loginResult = "Failed", message = "Incorrect username or password" });
        }

        // -----------------
        // Credentials ok...

        if (uid != null){
          // Already logged in
          appUser = await _userManager.FindByIdAsync(vipUserId);
          return LoginSuccessResponse(appUser); // Tell the user they are already logged in.
        }

        // Not logged in yet...
        appUser = await _userManager.FindByIdAsync(vipUserId); // Look up the VIP user

        if (appUser == null)
        {
          // There is no database record.
          return this.StatusCode(StatusCodes.Status500InternalServerError, "Could not find user record.");
        }

        // -----------------------------
        // appUser exists in database...

        var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, vipUserId));
        identity.AddClaim(new Claim(ClaimTypes.Name, vipUserName));

        var result = await _signInManager.PasswordSignInAsync(appUser, vipPassword, PersistAfterBrowserClose, LockoutOnFailure); // Perform the login.

        if (result.Succeeded){
          return LoginSuccessResponse(appUser); // Tell the user they are now logged in.
        }
        if (result.RequiresTwoFactor){
          return this.StatusCode(StatusCodes.Status202Accepted, "Redirect the user to complete two-factor authentication");
        }
        if (result.IsLockedOut){
          return this.StatusCode(StatusCodes.Status423Locked, "User account is locked out");
        }

        return this.StatusCode(StatusCodes.Status400BadRequest, "Invalid login attempt");
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
      }
    }
  }
}
