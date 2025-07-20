using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace ReactWithASP.Server.Controllers.Admin
{
  [Authorize]
  [ApiController]
  [Route("api")]
  public class AdminUserAccountsController : AdminBaseController
  {
    protected UserManager<AppUser> _userManager;

    public AdminUserAccountsController(UserManager<AppUser> userManager){
      _userManager = userManager;
    }

    [HttpGet("admin-useraccounts")]
    public ActionResult GetUserAccounts()
    {
      try
      {
        IEnumerable<AppUser> users = _userManager.Users.ToList();
        return Ok(users);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }
  }
}
