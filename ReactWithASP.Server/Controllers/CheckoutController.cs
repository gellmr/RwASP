using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.DTO.OrderDTOs;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CheckoutController: ShopController
  {
    private IOrdersRepository ordersRepo;

    public CheckoutController(ICartLineRepository rRepo, IGuestRepository gRepo, IInStockRepository pRepo, IOrdersRepository oRepo, Microsoft.AspNetCore.Identity.UserManager<AppUser> userManager) : base(rRepo, gRepo, pRepo, userManager) {
      ordersRepo = oRepo;
    }

    [HttpPost("submit")] // POST api/checkout/submit.  Accepts application/json POST submissions containing stringified JSON data in request body.
    public async Task<IActionResult> Submit([FromBody] CheckoutSubmitDTO checkoutSubmit)
    {
      if (!ModelState.IsValid){ return BadRequest(ModelState); }
      
      // Save the guest name and email value, to the database.
      Guest guest = new Guest();
      guest.Email = checkoutSubmit.ShipEmail;
      guest.FirstName = checkoutSubmit.FirstName;
      guest.LastName = checkoutSubmit.LastName;
      guest = EnsureGuestFromCookieAndDb(guest); // Lookup the guest. All values may be blank except ID
      
      bool savedOk = false;

      DateTimeOffset now = DateTimeOffset.Now;
      string shipAddress = Order.ParseAddress(checkoutSubmit);
      
      AddressDTO shipAddy = new AddressDTO{
        Line1 = checkoutSubmit.ShipLine1,
        Line2 = checkoutSubmit.ShipLine2,
        Line3 = checkoutSubmit.ShipLine3,
        City = checkoutSubmit.ShipCity,
        State = checkoutSubmit.ShipState,
        Country = checkoutSubmit.ShipCountry,
        Zip = checkoutSubmit.ShipZip
      };

      Order order1 = new Order();
      order1.OrderPlacedDate = now;
      order1.BillingAddress = shipAddress;
      order1.ShippingAddress = shipAddress;
      order1.OrderStatus = Order.ParseShippingState(ShippingState.OrderPlaced);

      // Create an ordered product for each cart line
      foreach (CartSubmitLineDTO line in checkoutSubmit.cart){
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

      AppUser? appUser;
      string? uid = GetLoggedInUserIdFromIdentityCookie(); // Lookup the currently logged in user.
      if (uid != null){
        appUser = await _userManager.FindByIdAsync(uid);
      }

      UserType userType = (uid != null) ? UserType.AppUser : UserType.Guest;

      try{
        switch(userType){
          case UserType.Guest :
            order1.GuestID = guest.ID;
            order1.Guest = guest;
            break;
          case UserType.AppUser : break;
            order1.AppUser = appUser;
            order1.UserID = uid;
          case UserType.GoogleAppUser: break;
          case UserType.None : break;
        }
        savedOk = ordersRepo.SaveOrder(order1);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
      if (savedOk){
        cartLineRepo.ClearCartLines(guest.ID); // Clear the cart of this user.
      }
      return Ok(checkoutSubmit); // Respond with 200 OK, and automatically cast object to JSON for the response.
    }

  }
}