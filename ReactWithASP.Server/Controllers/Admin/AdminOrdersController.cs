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
    private IOrdersRepository ordersRepo;

    public AdminOrdersController(IOrdersRepository oRepo) : base(){
      ordersRepo = oRepo;
    }

    [HttpGet("admin-orders")]    // GET "/api/admin-orders"
    public IActionResult GetOrders()
    {
      OrderSlugDTO order1 = new OrderSlugDTO{
        ID = "101",
        OrderPlacedDate = DateTime.Now,
        UserID = "111"
      };
      OrderSlugDTO order2 = new OrderSlugDTO { ID = "102", OrderPlacedDate = DateTime.Now, UserID = "111" };
      OrderSlugDTO order3 = new OrderSlugDTO { ID = "103", OrderPlacedDate = DateTime.Now, UserID = "111" };
      var orders = new List<OrderSlugDTO> { order1, order2, order3 };

      bool success = true;
      if (success){
        return Ok(new { orders = orders }); // Automatically cast object to JSON.
      }
      return BadRequest(new { errMessage="Something went wrong." });
    }
  }
}
