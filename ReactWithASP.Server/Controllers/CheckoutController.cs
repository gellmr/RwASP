using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;

namespace ReactWithASP.Server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CheckoutController: ShopController
  {
    private IOrdersRepository ordersRepo;

    public CheckoutController(ICartLineRepository rRepo, IGuestRepository gRepo, IInStockRepository pRepo, IOrdersRepository oRepo) : base(rRepo, gRepo, pRepo) {
      ordersRepo = oRepo;
    }

    [HttpPost("submit")] // POST api/checkout/submit.  Accepts application/json POST submissions containing stringified JSON data in request body.
    public IActionResult Submit([FromBody] CheckoutSubmitDTO checkoutSubmit)
    {
      if (!ModelState.IsValid){ return BadRequest(ModelState); }
      Guest guest = EnsureGuestIdFromCookie();
      Nullable<Guid> guestId = guest.ID;
      bool savedOk = false;
      UserType userType = UserType.Guest;
      switch(userType){
        case UserType.Guest :
          Order order1 = new Order();
          string shipAddress = Order.ParseAddress(checkoutSubmit);
          DateTimeOffset now = DateTimeOffset.Now;
          order1.GuestID = guestId;
          order1.UserID = null;
          order1.OrderPlacedDate = now;
          order1.PaymentReceivedDate = null;
          order1.ReadyToShipDate = null;
          order1.ShipDate = null;
          order1.ReceivedDate = null;
          order1.BillingAddress = shipAddress;
          order1.ShippingAddress = shipAddress;
          order1.OrderStatus = Order.ParseShippingState(ShippingState.OrderPlaced);
          // Create an ordered product for each cart line
          foreach (CartSubmitLineDTO line in checkoutSubmit.cart)
          {
            InStockProduct myIsp = (InStockProduct)inStockRepo.InStockProducts.FirstOrDefault(p => p.ID == line.isp.id);
            OrderedProduct op1 = new OrderedProduct{
              InStockProduct = myIsp,
              InStockProductID = line.isp.id,
              OrderID = order1.ID,
              Order = order1,
              Quantity = line.qty
            };
            order1.OrderedProducts.Add(op1);
          }
          savedOk = ordersRepo.SaveOrder(order1);
          if (savedOk) {
            cartLineRepo.ClearCartLines(guestId); // Clear the cart of this user.
          }
          break;
        case UserType.AppUser : break;
        case UserType.None : break;
      }
      return Ok(checkoutSubmit); // Respond with 200 OK, and automatically cast object to JSON for the response.
    }

  }
}