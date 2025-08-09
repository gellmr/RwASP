using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Controllers.Admin;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.Domain.StoredProc;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace ReactWithASP.Server.Controllers.Admin
{
  public class AdminOrdersController : AdminBaseController
  {
    private IOrdersRepository orderRepo;

    public AdminOrdersController(IOrdersRepository oRepo, UserManager<AppUser> userManager, IGuestRepository gRepo) : base(userManager, gRepo){
      orderRepo = oRepo;
    }

    [HttpGet("admin-orders/{pageNum}")]    // GET "/api/admin-orders"
    public async Task<IActionResult> GetOrders(Int32 pageNum = 1)
    {
      try
      {
        // Validate controller arguments

        // If arguments missing, use ones from session.

        // If this is the first time page has been requested and session + arguments are missing, initialise arguments to default.

        IEnumerable<AdminOrderRow> rows = await orderRepo.GetOrdersWithUsersAsync(pageNum);
        if (rows == null || !rows.Any()){
          BadRequest(new { errMessage = "Something went wrong. Records not found." });
        }

        /*
        // Get list of orders
        IEnumerable<Order> currentPageOrders = orderRepo.GetOrdersWithUsersAsync()
          //.OrderBy(order => order.UserID);
          .OrderBy(order => order.ID);

        IEnumerable<Order> guestOrders       = currentPageOrders.Where(ord => (ord.UserID == null) && (ord.GuestID != null)).OrderBy(order => order.UserID);
        IEnumerable<Order> appUserOrders     = currentPageOrders.Where(ord => (ord.UserID != null) && (ord.GuestID == null)).OrderBy(order => order.UserID);
        */

        // If not specified, display Guest orders before AppUser orders.
        //List<Order> sorted = [.. guestOrders, .. appUserOrders];

        // Persist arguments to the session

        // Apply sorting here, according to what the user wants.
        List<OrderSlugDTO> sorted = rows
          .OrderBy(o => o.OrderPlaced).Reverse()
          .Select(order => order.OrderSlug)
          .ToList();
        bool success = true;
        if (success){
          return Ok(new { orders = sorted }); // Automatically cast object to JSON.
        }
      }
      catch(Exception ex){
        int a = 1;
      }
      return BadRequest(new { errMessage="Something went wrong." });
    }
  }
}
