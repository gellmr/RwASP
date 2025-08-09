using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain.Abstract;
using Microsoft.AspNetCore.Authorization;

namespace ReactWithASP.Server.Controllers
{
  [Authorize]
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
