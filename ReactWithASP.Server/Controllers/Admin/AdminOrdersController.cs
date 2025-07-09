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
      OrderSlugDTO order1 = new OrderSlugDTO {
        ID = "1111",
        Username = "Mike",
        UserID = "2222",
        AccountType = "Guest",
        Email = "order.UserOrGuestEmail",
        OrderPlacedDate = DateTime.Now,
        PaymentReceivedAmount = 100.0M,
        Outstanding = 50.0M,
        ItemsOrdered = 10,
        Items = "Some Items",
        OrderStatus = "OrderPlaced"
      };
      var slugs = new List<OrderSlugDTO> { order1 };

      bool success = true;
      if (success){
        return Ok(new { orders = slugs }); // Automatically cast object to JSON.
      }
      return BadRequest(new { errMessage="Something went wrong." });
    }
  }
}
