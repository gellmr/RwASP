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
  }
}
