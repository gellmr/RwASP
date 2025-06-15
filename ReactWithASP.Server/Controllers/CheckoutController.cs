using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;

namespace ReactWithASP.Server.Controllers
{


  [Route("api/[controller]")]
  [ApiController]
  public class CheckoutController: ControllerBase
  {
    private IOrdersRepository ordersRepo;
    public CheckoutController(IOrdersRepository oRepo) {
      ordersRepo = oRepo;
    }

    [HttpPost("submit")] // POST api/checkout/submit.  Accepts application/json POST submissions containing stringified JSON data in request body.
    public IActionResult Submit([FromBody] CheckoutSubmit checkoutSubmit)
    {
      Order order = new Order();
      order.OrderedProducts = new List<OrderedProduct>();
      ordersRepo.SaveOrder(order);
      return Ok(checkoutSubmit); // Respond with 200 OK, and automatically cast object to JSON for the response.
    }

    public class CheckoutSubmit
    {
      public string FirstName { get; set; }
      public string LastName { get; set; }
      public string ShipLine1 { get; set; }
      public string ShipLine2 { get; set; }
      public string ShipLine3 { get; set; }
      public string ShipCity { get; set; }
      public string ShipState { get; set; }
      public string ShipCountry { get; set; }
      public string ShipZip { get; set; }
      public string ShipEmail { get; set; }
    }
  }
}