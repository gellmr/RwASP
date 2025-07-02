using Microsoft.AspNet.Identity; // Provides PasswordHasher.
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

      // Add the VIP AppUser
      string vipUserName = _config.GetSection("Authentication:VIP:UserName").Value;
      string vipPassword = _config.GetSection("Authentication:VIP:Password").Value;
      IPasswordHasher hasher = new PasswordHasher();
      string hashedVipPassword = hasher.HashPassword(vipPassword);

      AppUser vipAppUser = new AppUser{
        Id = _config.GetSection("Authentication:VIP:Id").Value,
        UserName = vipUserName,
        PasswordHash = hashedVipPassword,
        //IsGuest = _config.GetSection("Authentication:VIP:IsGuest").Value,
        Email = _config.GetSection("Authentication:VIP:Email").Value,
        EmailConfirmed = Boolean.Parse(_config.GetSection("Authentication:VIP:EmailConfirmed").Value),
        SecurityStamp = _config.GetSection("Authentication:VIP:SecurityStamp").Value,
        PhoneNumber = _config.GetSection("Authentication:VIP:PhoneNumber").Value,
        PhoneNumberConfirmed = Boolean.Parse(_config.GetSection("Authentication:VIP:PhoneNumberConfirmed").Value),
        TwoFactorEnabled = Boolean.Parse(_config.GetSection("Authentication:VIP:TwoFactorEnabled").Value),
        //LockoutEndDateUtc = _config.GetSection("Authentication:VIP:LockoutEndDateUtc").Value,
        LockoutEnabled = Boolean.Parse(_config.GetSection("Authentication:VIP:LockoutEnabled").Value),
        AccessFailedCount = Int32.Parse(_config.GetSection("Authentication:VIP:AccessFailedCount").Value),
      };
      _context.AppUser.Add(vipAppUser);

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
