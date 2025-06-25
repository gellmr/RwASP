using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;
using System.ComponentModel.DataAnnotations;

namespace ReactWithASP.Server.Controllers
{
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

    [HttpGet] // GET api/cart
    public ActionResult Get()
    {
      Guest guest = EnsureGuestIdFromCookie();

      // Get all CartLine rows for this Guest
      IEnumerable<CartUpdateDTO> cartLinesDistinctByIsp = cartLineRepo.CartLines
      .DistinctBy(line => line.InStockProductID)
      .Select(cartLine => new CartUpdateDTO{
        guestID = guest.ID,
        cartLineID = (Int32)cartLine.ID,
        qty        = (Int32)cartLine.Quantity,
        isp = new IspDTO{
          id          = cartLine.InStockProduct.ID,
          title       = cartLine.InStockProduct.Title,
          description = cartLine.InStockProduct.Description,
          price       = cartLine.InStockProduct.Price,
          category    = (Int32)cartLine.InStockProduct.Category
        }
      }).ToList();

      return Ok( cartLinesDistinctByIsp ); // Respond with 200 OK, and list of cartLine objects.
    }

    private Guest EnsureGuestIdFromCookie()
    {
      // See if guest id cookie exists...
      Guest guest = null;
      Nullable<Guid> guestId;
      bool createGuest = false;
      string cookieGuestId = Request.Cookies[MyExtensions.GuestCookieName];
      if (string.IsNullOrEmpty(cookieGuestId))
      {
        // Cookie value is not available
        createGuest = true;
        guestId = Guid.NewGuid(); // Create guest ID for the first time.
      }
      else
      {
        // Cookie value is available...
        guestId = cookieGuestId.ToNullableGuid();
        guest = guestRepo.Guests.FirstOrDefault(g => g.ID == guestId); // Look up guest in database.
        if (guest == null){
          createGuest = true; // Record was not found in database.
        }
      }
      
      if (createGuest)
      {
        // Create guest record in database.
        guest = new Guest { ID = guestId };
        guestRepo.SaveGuest(guest);
      }

      // Store guest id in cookie...
      HttpContext.Response.Cookies.Delete(MyExtensions.GuestCookieName);
      Response.Cookies.Append(MyExtensions.GuestCookieName, guestId.ToString(), MyExtensions.GuestCookieOptions);
      return guest;
    }

    [HttpPost]
    [Route("clear")] // POST api/cart/clear
    public ActionResult Clear(Nullable<Guid> guestId)
    {
      // Try to look up the guest. If no guest, create new guest.
      Guest guest = EnsureGuestIdFromCookie();
      guestId = guest.ID;

      // Remove all CartLine records for this Guest ID.
      cartLineRepo.ClearCartLines(guestId);

      // Send back response to client indicating success or failure.
      CartResponseDTO cartResponse = new CartResponseDTO { guestID = guestId };
      return Ok(cartResponse); // 200 ok
    }

    [HttpPost]
    [Route("update")] // POST api/cart/update  Accepts POST data with JSON in Request Body. Content-Type must be 'application/json'
    public ActionResult Update([FromBody] CartUpdateDTO cartUpdate, Nullable<Guid> guestId)
    {
      // Client cart has been updated with the given quantities.
      // Update the user's cart in the database...

      // Try to look up the guest. If no guest, create new guest.
      Guest guest = EnsureGuestIdFromCookie();
      guestId = guest.ID;

      // Look up (isp) product in database.
      InStockProduct isp = inStockRepo.InStockProducts.FirstOrDefault(record => record.ID == cartUpdate.isp.id);
      if (isp == null){
        Response.StatusCode = StatusCodes.Status422UnprocessableEntity;
        return new JsonResult(new { Message = "InStockProduct not found" });
      }

      // Create database entry for new CartLine, connected to user/guest and the existing InStockProduct.
      CartLine cartLine = new CartLine{
        ID = cartUpdate.cartLineID ?? null, // Must be null when we are creating or DB will complain.
        GuestID = guestId,
        Guest = guest,
        InStockProductID = isp.ID,
        InStockProduct = isp,
        Quantity = cartUpdate.qty,
        UserID = null,
        AppUser = null
      };
      CartLine? updatedCartLine = cartLineRepo.SaveCartLine(cartLine);

      // Prepare JSON for client
      cartUpdate.cartLineID = cartUpdate.cartLineID ?? (Int32)updatedCartLine.ID;
      cartUpdate.guestID = guestId;
      cartUpdate.isp = (updatedCartLine == null) ? null : new IspDTO
      {
         id          = updatedCartLine.InStockProduct.ID,
         title       = updatedCartLine.InStockProduct.Title,
         description = updatedCartLine.InStockProduct.Description,
         price       = updatedCartLine.InStockProduct.Price,
         category    = (Int32)updatedCartLine.InStockProduct.Category
      };

      // Send back response to client indicating success or failure.
      return Ok(cartUpdate); // Respond with 200 OK, and the finalised cart state.
    }
  }
}
