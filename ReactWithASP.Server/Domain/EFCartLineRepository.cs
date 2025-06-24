using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Controllers;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Domain
{
  public class EFCartLineRepository: ICartLineRepository
  {
    private readonly IConfiguration _config;
    private StoreContext context;

    public EFCartLineRepository(IConfiguration c){
      _config = c;
      context = new StoreContext(_config);
    }

    public IEnumerable<CartLine> CartLines{
      get{
        IEnumerable<CartLine> cartLines = context.CartLines.ToList();
        foreach (CartLine c in cartLines){
          // Load the entities associated with this CartLine.
          c.InStockProduct = context.InStockProducts.FirstOrDefault(p => p.ID == c.InStockProductID);
        }
        return cartLines;
      }
    }

    public void ClearCartLines(Nullable<Guid> guestID)
    {
      IEnumerable<CartLine> lines = context.CartLines.Where(line => line.Guest != null && (line.Guest.ID == guestID));
      foreach (CartLine c in lines){
        context.CartLines.Remove(c);
      }
      context.SaveChanges();
    }


    public CartLine? SaveCartLine(CartLine cartLine)
    {
      CartLine? existingCartLine = null;

      // if (cartLine.UserID != null){
      //   // AppUser account
      //   existingCartLine = context.CartLines.FirstOrDefault(record =>
      //     record.ID == cartLine.ID &&
      //     record.UserID == cartLine.UserID &&
      //     record.InStockProductID == cartLine.InStockProductID
      //   );
      // } else if
      if (cartLine.GuestID != null)
      {
        // Guest account
        existingCartLine = context.CartLines.FirstOrDefault(record =>
          record.ID == cartLine.ID &&
          record.GuestID == cartLine.GuestID &&
          record.InStockProductID == cartLine.InStockProductID
        );
        // Load associated entities
        existingCartLine.InStockProduct = context.InStockProducts.FirstOrDefault(isp => isp.ID == existingCartLine.InStockProductID );
        existingCartLine.Guest = context.Guests.FirstOrDefault( g => g.ID == cartLine.GuestID );
      }
      
      if (existingCartLine == null && (cartLine.ID == null))
      {
        // Create new record
        context.CartLines.Add(cartLine); // The cartLine.ID must be null when we are creating, or the DB will complain.

        // Set Unchanged for associated entities
        InStockProduct isp = cartLine.InStockProduct;
        Guest? guest = cartLine.Guest;
        context.Entry(isp).State = EntityState.Unchanged;   // Dont create InStockProduct. It already exists in database.
        context.Entry(guest).State = EntityState.Unchanged; // Dont create Guest. It already exists in database.

        context.SaveChanges();
        return cartLine; // Return the updated record.
      }
      else
      {
        if (cartLine.Quantity == 0)
        {
          // Remove
          context.CartLines.Remove(existingCartLine);
          context.SaveChanges();
          return null; // CartLine was successfully deleted from database.
        }
        else
        {
          // Update
          existingCartLine.Quantity = cartLine.Quantity;

          Int32 updatedCartLineID = (Int32)existingCartLine.ID;        // The CartLine ID of the record we just updated.
          Int32 updatedIsp = (Int32)existingCartLine.InStockProductID; // The InStockProductID of the CartLine we just updated.

          // Remove any duplicate CartLines for this InStockProductID, which belong to the Guest.
          IList<CartLine> duplicateIsps = context.CartLines.Where( line =>
            (line.ID != updatedCartLineID) &&
            (line.GuestID == cartLine.GuestID) &&
            (line.InStockProductID == updatedIsp)
          ).ToList();
          context.CartLines.RemoveRange(duplicateIsps);

          context.SaveChanges();
          return existingCartLine; // Return the updated record.
        }
      }
    }
  }
}
