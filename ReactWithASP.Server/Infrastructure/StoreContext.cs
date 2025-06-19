using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ReactWithASP.Server.Domain;

namespace ReactWithASP.Server.Infrastructure
{
  /*
  DbContext in EF Core allows us to...
  ------------------------------------
  Manage the database connection
  Configure models & relationships
  Query the database
  Save data to the database
  Configure change tracking
  Caching
  Transaction management
  */
  public class StoreContext : DbContext
  {
    private IConfiguration _config;

    // Define Entities we want EF to track and perform CRUD operations
    public DbSet<OrderedProduct> OrderedProducts { get; set; }
    public DbSet<InStockProduct> InStockProducts { get; set; }
    public DbSet<CartLine> CartLine { get; set; }
    public DbSet<Order> Orders { get; set; }

    public StoreContext(IConfiguration c){ // receive the configuration object through DI
      _config = c;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      // Runs during startup, after connection string is loaded from JSON config file. (Not in source control)
      string conn = _config.GetConnectionString("StoreContext");
      optionsBuilder.UseSqlServer(conn);
    }
  }
}
