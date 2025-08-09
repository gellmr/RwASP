using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace ReactWithASP.Server.Controllers.Admin
{
  [ApiController]
  [Route("api")]
  public class AdminBaseController : MyAuthenticatedController
  {
    public AdminBaseController(UserManager<AppUser> userManager, IGuestRepository gRepo) : base(userManager, gRepo) {}
  }
}
