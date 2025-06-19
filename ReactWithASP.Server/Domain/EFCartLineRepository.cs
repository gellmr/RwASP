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

    public void SaveCartLine(CartLine cartLine)
    {
      bool exists = context.CartLines.Any(record => record.ID == cartLine.ID);
      if (exists)
      {
        // update
        CartLine dbEntry = context.CartLines.First(record => record.ID == cartLine.ID);
        dbEntry.Quantity = cartLine.Quantity;
        context.SaveChanges();
      }
      else
      {
        // create new record
        context.CartLines.Add(cartLine);
        InStockProduct ip = cartLine.InStockProduct;
        Guest g = cartLine.Guest;
        context.Entry(ip).State = EntityState.Unchanged; // Dont create the product. It already exists in database
        context.Entry(g).State = EntityState.Unchanged; // Dont create guest. It already exists in database.
        context.SaveChanges();
      }
    }
  }
}
