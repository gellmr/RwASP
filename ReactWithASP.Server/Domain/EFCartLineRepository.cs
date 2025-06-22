using Microsoft.EntityFrameworkCore;
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

    public Int32? SaveCartLine(CartLine cartLine)
    {
      CartLine dbEntry = context.CartLines.FirstOrDefault(record => record.InStockProductID == cartLine.InStockProductID);
      if( dbEntry != null )
      {
        if (cartLine.Quantity == 0)
        {
          // Remove
          context.CartLines.Remove(dbEntry);
          context.SaveChanges();
          return -1;
        }
        else
        {
          // Update
          dbEntry.Quantity = cartLine.Quantity;
          context.SaveChanges();
          return dbEntry.ID;
        }
      }
      else
      {
        // Create new record
        context.CartLines.Add(cartLine);

        // Set Unchanged for associated entities
        InStockProduct isp = cartLine.InStockProduct;
        Guest? guest = cartLine.Guest;
        context.Entry(isp).State = EntityState.Unchanged;   // Dont create InStockProduct. It already exists in database.
        context.Entry(guest).State = EntityState.Unchanged; // Dont create Guest. It already exists in database.

        context.SaveChanges();
        return cartLine.ID ?? null;
      }
    }
  }
}
