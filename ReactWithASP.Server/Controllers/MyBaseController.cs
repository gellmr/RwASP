using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Controllers
{
  public class MyBaseController : ControllerBase
  {
    public MyBaseController() { }

    protected void SaveAppUserToCookie(AppUser? appUser)
    {
      // Update cookie to persist the login, and give the user access to actions restricted by Authorize
      // Due to character restrictions we cannot serialise a C# object and save it in the cookie.
      // Instead I will save the AppUser Id and use it to lookup from the database / session whenever a request comes.

      // Save the AppUser Id into the cookie...
      string appUserId = appUser.Id; // eg "111"

      HttpContext.Response.Cookies.Delete(MyExtensions.AppUserCookieName);
      Response.Cookies.Append(MyExtensions.AppUserCookieName, appUserId, MyExtensions.CookieOptions);
    }
  }
}
