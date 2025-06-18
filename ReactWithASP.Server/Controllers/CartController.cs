using Microsoft.AspNetCore.Mvc;

namespace ReactWithASP.Server.Controllers
{
  public class CartUpdateDTO
  {
    public Int32 itemID { get; set; }
    public Int32 itemQty { get; set; }
    public Int32 adjust { get; set; }
  }

  [ApiController]
  [Route("api/[controller]")]
  public class CartController: ControllerBase
  {
    [HttpPost]
    [Route("update")] // POST api/cart/update  Accepts POST data with JSON in Request Body. Content-Type must be 'application/json'
    public ActionResult Update([FromBody] CartUpdateDTO cartUpdate)
    {
      // Client cart has been updated with the given quantities.
      return Ok(); // Respond with 200 OK
    }
  }
}
