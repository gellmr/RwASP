using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.DTO.MyOrders;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class MyOrdersController: ShopController
  {
    private IOrdersRepository ordersRepo;
    protected UserManager<AppUser> _userManager;

    public MyOrdersController(ICartLineRepository rRepo, IGuestRepository gRepo, IInStockRepository pRepo, IOrdersRepository oRepo, UserManager<AppUser> userManager) : base(rRepo, gRepo, pRepo){
      ordersRepo = oRepo;
      _userManager = userManager;
    }

    [HttpPost]
    [Route("fetch-orders")]
    public async Task<ActionResult> FetchOrders(UserIdDTO userInfo)
    {
      try
      {
        Guest? guest = EnsureGuestFromCookieAndDb(null);
        userInfo.gid ??= guest.ID;

        if (userInfo != null){
          if (!(PcreValidation.ValidString(userInfo.uid, MyRegex.AppUserId) || PcreValidation.ValidString(userInfo.uid, MyRegex.GoogleSubject))){
            return this.StatusCode(StatusCodes.Status400BadRequest, "Invalid uid");
          }
        }
        
        if (userInfo.uid == null && userInfo.gid == null){
          return this.StatusCode(StatusCodes.Status400BadRequest, "User ID unavailable.");
        }

        // Look up associated records, to display on the My Orders page.
        IList<Order> orders = ordersRepo.GetMyOrders( userInfo ).ToList();
        foreach (Order order in orders)
        {
          if (order.GuestID != null)
          {
            order.Guest = guestRepo.Guests.FirstOrDefault(g => g.ID == order.GuestID);
          }
          if (order.UserID != null)
          {
            order.AppUser = await _userManager.FindByIdAsync(order.UserID);
          }
        }
        return Ok(new{ Rows = orders, Message = "Success"});
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }
  }
}
