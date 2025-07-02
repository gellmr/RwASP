using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ReactWithASP.Server.Controllers.Admin;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;

namespace ReactWithASP.Server.Controllers
{
  [Authorize(AuthenticationSchemes = "Cookies, Google")] // This will initiate a request to Google API, from "https://localhost:5173/api/admin-orders" to try and confirm our token.
  [ApiController]
  [Route("api")]
  public class AdminOrdersController : AdminBaseController
  {
    private IOrdersRepository ordersRepo;

    public AdminOrdersController(IOrdersRepository oRepo) : base(){
      ordersRepo = oRepo;
    }

    [HttpPost("admin-orders")] // POST "/api/admin-orders"
    public IActionResult GetOrders()
    {

      OrderSlugDTO order1 = new OrderSlugDTO{
        ID = "123",
        OrderPlacedDate = DateTime.Now,
        UserID = "111"
      };
      var orders = new List<OrderSlugDTO> { order1 };

      bool success = true;
      if (success){
        return Ok(new { orders = orders }); // Automatically cast object to JSON.
      }
      return BadRequest(new { errMessage="Something went wrong." });
    }
  }
}
