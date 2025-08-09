using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain.Abstract;

namespace ReactWithASP.Server.Controllers.Admin
{
  public class AdminBaseController : MyAuthenticatedController
  {
    public AdminBaseController(UserManager<AppUser> userManager, IGuestRepository gRepo) : base(userManager, gRepo) {}
  }
}
