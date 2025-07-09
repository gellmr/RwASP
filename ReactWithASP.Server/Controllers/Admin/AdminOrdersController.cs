using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ReactWithASP.Server.Controllers.Admin;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;

namespace ReactWithASP.Server.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api")]
  public class AdminOrdersController : AdminBaseController
  {
    private IOrdersRepository orderRepo;

    public AdminOrdersController(IOrdersRepository oRepo) : base(){
      orderRepo = oRepo;
    }

    [HttpGet("admin-orders")]    // GET "/api/admin-orders"
    public IActionResult GetOrders()
    {
      // Validate controller arguments

      // If arguments missing, use ones from session.

      // Get list of orders
      IEnumerable<Order> currentPageOrders = orderRepo.GetOrdersWithUsersAsync().OrderBy(order => order.UserID);
      IEnumerable<Order> guestOrders       = currentPageOrders.Where(ord => (ord.UserID == null) && (ord.GuestID != null)).OrderBy(order => order.UserID);
      IEnumerable<Order> appUserOrders     = currentPageOrders.Where(ord => (ord.UserID != null) && (ord.GuestID == null)).OrderBy(order => order.UserID);

      // If not specified, display Guest orders before AppUser orders.
      List<Order> sorted = [.. guestOrders, .. appUserOrders];

      // Serve the sorted list as JSON
      IEnumerable<OrderSlugDTO> rows = new List<OrderSlugDTO>();
      try{
        rows = sorted.Select(order => new OrderSlugDTO{
          ID = (order.ID == null) ? string.Empty : order.ID.ToString(),
          Username = order.UserOrGuestName,
          UserID = order.UserOrGuestId,
          AccountType = order.AccountType,
          Email = order.UserOrGuestEmail,
          OrderPlacedDate = order.OrderPlacedDate.ToString(),
          PaymentReceivedAmount = order.OrderPaymentsReceived.ToString(),
          Outstanding = order.Outstanding.ToString(),
          ItemsOrdered = order.QuantityTotal.ToString(),
          Items = order.ItemString,
          OrderStatus = order.OrderStatus
        }).ToList();
      }catch(Exception ex){
        int a = 1;
      }
      bool success = true;
      if (success){
        return Ok(new { orders = rows }); // Automatically cast object to JSON.
      }
      return BadRequest(new { errMessage="Something went wrong." });
    }
  }
}
