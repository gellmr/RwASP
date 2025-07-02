using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api")]
  public class AdminLoginController: ShopController
  {
    private IConfiguration _config;
    protected IAppUserRepo appUserRepo;

    public AdminLoginController(ICartLineRepository rRepo, IGuestRepository gRepo, IInStockRepository pRepo, IAppUserRepo aRepo, IConfiguration c) : base(rRepo, gRepo, pRepo){
      _config = c;
      appUserRepo = aRepo;
    }

    [HttpPost("admin-login")] // POST /api/admin-login.  Accepts application/json POST submissions containing stringified JSON data in request body.
    public async Task<IActionResult> AdminLogin([FromBody] AdminLoginSubmitDTO adminLoginSubmitDTO)
    {
      if (!ModelState.IsValid) { return BadRequest(ModelState); }
      Guest guest = EnsureGuestIdFromCookie();
      Nullable<Guid> guestId = guest.ID;
      UserType userType = UserType.Guest;

      string vipUserName = _config.GetSection("Authentication:VIP:UserName").Value;
      string vipPassword = _config.GetSection("Authentication:VIP:Password").Value;

      AppUser? appUser;
      if (
        adminLoginSubmitDTO.username.Equals(vipUserName) &&
        adminLoginSubmitDTO.password.Equals(vipPassword)){

        // Login as VIP user
        string vipUserId = _config.GetSection("Authentication:VIP:Id").Value;
        appUser = await appUserRepo.FindAppUserById(vipUserId);
        if (appUser != null){
          userType = UserType.AppUser;
          SaveAppUserToCookie(appUser);
          guest = null;
          guestId = null;
          return Ok(new { loginResult = "Success", loginType = "VIP AppUser" });
        }
      }
      return BadRequest(new { loginResult = "Incorrect username or password" });
    }
  }
}
