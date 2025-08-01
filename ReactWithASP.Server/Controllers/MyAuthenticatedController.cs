using ReactWithASP.Server.Infrastructure;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace ReactWithASP.Server.Controllers
{
  public class MyAuthenticatedController : MyBaseController
  {
    protected UserManager<AppUser> _userManager;

    public MyAuthenticatedController(UserManager<AppUser> userManager){
      _userManager = userManager;
    }

    protected async Task<AppUser> EnsureAppUser()
    {
      if (User.Identity.IsAuthenticated)
      {
        // Get the user's unique ID from the NameIdentifier claim
        string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        AppUser appUser = await _userManager.FindByIdAsync(userId);
        return appUser;
      }
      throw new Exception("Could not get AppUser");
    }
  }
}
