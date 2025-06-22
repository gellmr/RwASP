using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Domain;

namespace ReactWithASP.Server.Infrastructure
{
  public class InStockProductDTO // Temporary class to help us populate our objects from JSON
  {
    public int? ID { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? Category { get; set; }
  }

  public class DataSeeder
  {
    private IConfiguration _config;
    private StoreContext _context;

    public static List<InStockProductDTO> inStockDTOs;
    public static IList<InStockProduct> inStockProducts;

    public DataSeeder(StoreContext ctx, IConfiguration config){
      _context = ctx;
      _config = config;
    }

    public void Seed()
    {
      // We want to keep CartLine records, and Guest records. All other tables can be cleared.

      // Delete all rows for the tables we are recreating...
      //_context.AppUser.RemoveRange(_context.AppUser);
      _context.InStockProducts.RemoveRange(_context.InStockProducts);
      //_context.OrderedProducts.RemoveRange(_context.OrderedProducts);
      //_context.OrderPayments.RemoveRange(_context.OrderPayments);
      //_context.Orders.RemoveRange(_context.Orders);

      // Populate InStockProduct
      inStockDTOs = _config.GetSection("instockproducts").Get<List<InStockProductDTO>>();
      inStockProducts = new List<InStockProduct>();
      for ( int pIdx = 0; pIdx < 27; pIdx++ ){ SeedInStockProducts(pIdx); }
      _context.InStockProducts.AddRange(inStockProducts.ToArray());

      // All done.
      _context.SaveChanges();
    }

    private static void SeedInStockProducts(int idx){
      InStockProductDTO dto = inStockDTOs[idx];
      InStockProduct prod = new InStockProduct{
        // Dont set the ID. Allow database to generate it for us.
        Title = dto.Name,
        Description = dto.Description,
        Price = (decimal)dto.Price,
        Category = ProductCategory.ParseCat(dto.Category)
      };
      inStockProducts.Add(prod);
    }
  }
}
