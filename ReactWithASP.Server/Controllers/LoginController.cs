using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;
using System.Security.Claims;

namespace ReactWithASP.Server.Controllers
{
  public abstract class LoginController: ShopController
  {
    protected SignInManager<AppUser> _signInManager;
    protected IConfiguration _config;
    protected bool PersistAfterBrowserClose = false; // false means the cookie is session-based
    protected bool LockoutOnFailure = false;

    public LoginController(
      ICartLineRepository cartRepo,
      IGuestRepository guestRepo,
      IInStockRepository inStockRepo,
      IConfiguration config,
      UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager
    ): base(cartRepo, guestRepo, inStockRepo, userManager)
    {
      _config = config;
      _signInManager = signInManager;
    }

    // Generate a response indicating the user has successfully logged in
    [NonAction]
    protected IActionResult LoginSuccessResponse(AppUser? appUser, Guid? guestId, bool isGoogle=false)
    {
      if (guestId != null) {
        cartLineRepo.ClearCartLines(guestId);
      }
      DeleteGuestCookie();

      return Ok(new
      {
        loginResult = "Success",
        loginType = "User",
        isGoogleSignIn = isGoogle, 
        appUserId = appUser.Id,
        fullname = appUser.FullName,
        firstname = AppUser.GetFirstName(appUser.FullName),
        lastname = AppUser.GetLastName(appUser.FullName),
        email = appUser.Email,
      });
    }
  }
}
