using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Domain.StoredProc;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Controllers.Admin
{
  [Authorize]
  [ApiController]
  [Route("api")]
  public class AdminUserOrdersController : AdminBaseController
  {
    private IOrdersRepository orderRepo;

    public AdminUserOrdersController(Microsoft.AspNetCore.Identity.UserManager<AppUser> userManager, IOrdersRepository oRepo) : base(userManager){
      orderRepo = oRepo;
    }

    [HttpGet("admin-user-orders")]
    public async Task<ActionResult> GetUserOrders(string? idval, string? usertype)
    {
      try
      {
        // Ensure the given idval is equivalent to a (Guid) or a Google Subject Id (20-255 numeric value)
        if (!(PcreValidation.ValidString(idval, MyRegex.AppUserOrGuestId) || PcreValidation.ValidString(idval, MyRegex.GoogleSubject))){
          return this.StatusCode(StatusCodes.Status400BadRequest, "Invalid idval");
        }
        idval = (idval == null) ? null : idval.ToLower();
        IEnumerable<Order> orders = orderRepo.GetUserOrders(idval, usertype);
        return Ok(orders);
      }
      catch (Exception ex){
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }
  }
}
