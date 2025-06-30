using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api")]
  public class AdminLoginController: ShopController
  {
    private IConfiguration _config;
    public AdminLoginController(ICartLineRepository rRepo, IGuestRepository gRepo, IInStockRepository pRepo, IConfiguration c) : base(rRepo, gRepo, pRepo){
      _config = c;
    }

    [HttpPost("admin-login")] // POST /api/admin-login.  Accepts application/json POST submissions containing stringified JSON data in request body.
    public IActionResult AdminLogin([FromBody] AdminLoginSubmitDTO adminLoginSubmitDTO)
    {
      if (!ModelState.IsValid) { return BadRequest(ModelState); }
      Guest guest = EnsureGuestIdFromCookie();
      Nullable<Guid> guestId = guest.ID;
      UserType userType = UserType.Guest;

      string vipUserName = _config.GetSection("Authentication:VIP:UserName").Value;
      string vipPassword = _config.GetSection("Authentication:VIP:Password").Value;

      if (
        adminLoginSubmitDTO.username.Equals(vipUserName) &&
        adminLoginSubmitDTO.password.Equals(vipPassword)){
        return Ok(new { loginResult = "Success" });
      }
      return BadRequest(new { loginResult = "Incorrect username or password" });
    }
  }
}
