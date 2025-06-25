using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using System.ComponentModel.DataAnnotations;

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
    public IActionResult Submit([FromBody] CheckoutSubmitDTO checkoutSubmit)
    {
      if (!ModelState.IsValid){
        return BadRequest(ModelState);
      }
      Order order = new Order();
      order.OrderedProducts = new List<OrderedProduct>();
      ordersRepo.SaveOrder(order);
      return Ok(checkoutSubmit); // Respond with 200 OK, and automatically cast object to JSON for the response.
    }

    public class CheckoutSubmitDTO
    {
      [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)]{1,50}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, 1-50 characters.")]
      public string? FirstName { get; set; }
      [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)]{1,50}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, 1-50 characters.")]
      public string? LastName { get; set; }

      [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)\:\/]{1,100}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, colon, forward slash, 1-100 characters.")]
      public string? ShipLine1 { get; set; }
      [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)\:\/]{1,100}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, colon, forward slash, 1-100 characters.")]
      public string? ShipLine2 { get; set; }
      [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)\:\/]{1,100}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, colon, forward slash, 1-100 characters.")]
      public string? ShipLine3 { get; set; }

      [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)]{1,50}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, 1-50 characters.")]
      public string? ShipCity { get; set; }
      [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)]{1,50}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, 1-50 characters.")]
      public string? ShipState { get; set; }
      [RegularExpression(@"^[A-Za-z0-9\s\-\.\,\(\)]{1,50}$", ErrorMessage = "Please use alphanumeric, spaces, dashes, period, comma, parentheses, 1-50 characters.")]
      public string? ShipCountry { get; set; }

      [RegularExpression(@"^[0-9]{4}$", ErrorMessage = "Please provide a 4 digit number.")]
      public string? ShipZip { get; set; }

      [RegularExpression(@"^[a-zA-Z0-9\.\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?){0,4}$", ErrorMessage = "Please provide a valid email address.")]
      public string? ShipEmail { get; set; }

      public Guid? guestID {get; set;}
      public List<CartSubmitLineDTO> cart {get; set;}
    }
  }
}