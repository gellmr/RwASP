using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Controllers.Admin;
using ReactWithASP.Server.Domain;

namespace ReactWithASP.Server.Controllers
{
  [ApiController]
  [Route("api")]
  public class AdminOrdersController : AdminBaseController
  {
    public AdminOrdersController() : base() { }

    [HttpGet("admin-orders")] // GET "/api/admin-orders"
    public IActionResult GetOrders()
    {
      List<string> orders = new List<string> {"aaa", "bbb", "ccc"};
      bool success = true;
      if (success){
        return Ok(new { orders = orders }); // Automatically cast object to JSON.
      }
      return BadRequest(new { errMessage="Something went wrong." });
    }
  }
}
