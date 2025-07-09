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
      IEnumerable<Order> currentPageOrders = orderRepo.GetOrdersWithUsersAsync(); // Gets all orders. TODO: add pagination

      //currentPageOrders = currentPageOrders.OrderBy(order => order.ID); // Sort by ID

      IEnumerable<OrderSlugDTO> rows = new List<OrderSlugDTO>();
      try
      {
        rows = currentPageOrders.Select(order => new OrderSlugDTO
        {
          ID = (order.ID == null) ? string.Empty : order.ID.ToString(),
          Username = order.UserOrGuestName,
          UserID = order.UserOrGuestId,
          AccountType = "order.AccountType",
          Email = "order.UserOrGuestEmail",
          OrderPlacedDate = "order.OrderPlacedDate",
          PaymentReceivedAmount = "(order.PriceTotal - order.Outstanding)",
          Outstanding = "order.Outstanding",
          ItemsOrdered = "order.QuantityTotal",
          Items = "order.ItemString",
          OrderStatus = order.OrderStatus
        }).ToList();
      }catch(Exception ex)
      {
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
