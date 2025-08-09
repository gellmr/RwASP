using ReactWithASP.Server.Infrastructure;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain.Abstract;

namespace ReactWithASP.Server.Controllers
{
  public class MyAuthenticatedController : MyBaseController
  {
    protected UserManager<AppUser> _userManager;
    protected IGuestRepository _guestRepo;

    public MyAuthenticatedController(UserManager<AppUser> userManager, IGuestRepository gRepo)
    {
      _userManager = userManager;
      _guestRepo = gRepo;
    }
  }
}
