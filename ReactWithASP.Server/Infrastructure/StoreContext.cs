using Google;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.StoredProc;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactWithASP.Server.Infrastructure
{
  public class StoreContext : IdentityDbContext<AppUser>
  {
    private IConfiguration _config;

    // Define Entities we want EF to track and perform CRUD operations
    public DbSet<OrderedProduct> OrderedProducts { get; set; }
    public DbSet<InStockProduct> InStockProducts { get; set; }
    public DbSet<CartLine> CartLines { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Guest> Guests { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<OrderPayment> OrderPayments { get; set; }
    public DbSet<AdminOrderRow> AdminOrderRows { get; set; } // Keyless (Stored Procedure)

    protected override void OnModelCreating(ModelBuilder modelBuilder){
      base.OnModelCreating(modelBuilder);
      // Define relationships here to enable Eager Loading of associated records...

      // Configure the relationship between Order and AppUser
      modelBuilder.Entity<Order>()
      .HasOne(o => o.AppUser)             // An Order has one User
      .WithMany(u => u.Orders)            // AppUser can have many Orders
      .HasForeignKey(o => o.UserID)       // The foreign key is UserID in Order
      .OnDelete(DeleteBehavior.Restrict); // Or .Cascade, depending on your needs. Restrict is often safer to prevent accidental deletions

      modelBuilder.Entity<Order>()
      .HasOne(o => o.Guest)
      .WithMany(u => u.Orders)
      .HasForeignKey(o => o.GuestID)
      .OnDelete(DeleteBehavior.Restrict);

      modelBuilder.Entity<Order>()
      .HasOne(o => o.ShipAddress);

      modelBuilder.Entity<Order>()
      .HasOne(o => o.BillAddress);

      //modelBuilder.Entity<Guest>()
      //.HasOne(e => e.DefaultAddress);

      modelBuilder.Entity<OrderedProduct>()
      .HasOne(p => p.Order)
      .WithMany(o => o.OrderedProducts)
      .HasForeignKey(p => p.OrderID)
      .OnDelete(DeleteBehavior.Restrict);

      modelBuilder.Entity<OrderedProduct>()
      .HasOne(o => o.InStockProduct);

      modelBuilder.Entity<OrderPayment>()
      .HasOne(p => p.Order)
      .WithMany(o => o.OrderPayments)
      .HasForeignKey(p => p.OrderID)
      .OnDelete(DeleteBehavior.Restrict);

      modelBuilder.Entity<AdminOrderRow>()
      .HasNoKey()
      .ToTable("AdminOrderRows", t => t.ExcludeFromMigrations());
    }

    public StoreContext(IConfiguration c) : base(){
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
