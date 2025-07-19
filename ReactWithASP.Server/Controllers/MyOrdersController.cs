using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;

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

    [HttpGet]
    public async Task<ActionResult> Get()
    {
      try{
        IList<Order> orders = ordersRepo.GetMyOrders().ToList();
        // Look up associated records, to display on the My Orders page.
        foreach (Order order in orders){
          if (order.GuestID != null){
            order.Guest = guestRepo.Guests.FirstOrDefault(g => g.ID == order.GuestID);
          }
          if (order.UserID != null){
            order.AppUser = await _userManager.FindByIdAsync(order.UserID);
          }
        }
        return Ok(orders);
      }
      catch(Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }
  }
}
