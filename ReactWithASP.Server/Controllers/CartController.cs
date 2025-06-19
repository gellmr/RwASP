using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;

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
    private ICartLineRepository cartLineRepo;
    private IGuestRepository guestRepo;
    private IInStockRepository inStockRepo;

    public CartController(ICartLineRepository rRepo, IGuestRepository gRepo, IInStockRepository pRepo) {
      cartLineRepo = rRepo;
      guestRepo = gRepo;
      inStockRepo = pRepo;
    }

    [HttpPost]
    [Route("update")] // POST api/cart/update  Accepts POST data with JSON in Request Body. Content-Type must be 'application/json'
    public ActionResult Update([FromBody] CartUpdateDTO cartUpdate, Nullable<Guid> guestId)
    {
      // Client cart has been updated with the given quantities.
      // TODO - Validate cartUpdate
      // TODO - Update the user's cart in the database

      // Try to look up the guest. If no guest, create new guest.
      Guest guest = null;
      guest = (guestId == null) ? new Guest { ID = Guid.NewGuid() } : guestRepo.Guests.FirstOrDefault(g => g.ID == guestId);
      guestRepo.SaveGuest(guest);
      
      // Look up product in database.
      InStockProduct cartProduct = inStockRepo.InStockProducts.FirstOrDefault(record => record.ID == cartUpdate.itemID);

      // Create database entry for new CartLine, connected to user/guest and the existing InStockProduct.
      CartLine cartLine = new CartLine{
        Quantity = cartUpdate.itemQty + cartUpdate.adjust,
        AppUser = null,
        UserID = null,
        Guest = guest,
        GuestID = guestId,
        InStockProductID = cartUpdate.itemID,
        InStockProduct = cartProduct
      };

      // NEED TO SEED PRODUCTS OR THE NEXT LINE WILL FAIL BECAUSE THERE ARE NO INSTOCKPRODUCTS IN THE DATABASE.
      cartLineRepo.SaveCartLine(cartLine);

      // Send back response to client indicating success or failure.
      return Ok(cartUpdate); // Respond with 200 OK, and the finalised cart state.
    }
  }
}
