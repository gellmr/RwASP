using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.DTO.RandomUserme;

namespace ReactWithASP.Server.Controllers.Admin
{
  [Authorize]
  [ApiController]
  [Route("api")]
  public class AdminUserAccountsController : AdminBaseController
  {
    protected UserManager<AppUser> _userManager;
    protected RandomUserMeApiClient _userMeService;

    public AdminUserAccountsController(UserManager<AppUser> userManager, RandomUserMeApiClient userMeService)
    {
      _userManager = userManager;
      _userMeService = userMeService;
    }

    [HttpGet("admin-useraccounts")]
    public async Task<ActionResult> GetUserAccounts()
    {
      try
      {
        IEnumerable<AppUser> users = _userManager.Users
          .ToList()
          .OrderBy(user => user.PhoneNumber);

        return Ok(users);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }
  }
}
