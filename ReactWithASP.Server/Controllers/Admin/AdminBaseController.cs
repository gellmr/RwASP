using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace ReactWithASP.Server.Controllers.Admin
{
  public class AdminBaseController : MyAuthenticatedController
  {
    public AdminBaseController(UserManager<AppUser> userManager) : base(userManager){}
  }
}
