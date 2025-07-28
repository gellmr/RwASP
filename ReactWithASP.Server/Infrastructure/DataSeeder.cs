using Microsoft.AspNet.Identity; // Provides PasswordHasher.
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.DTO.RandomUserme;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace ReactWithASP.Server.Infrastructure
{
  public class InStockProductSeederDTO // Temporary class to help us populate our objects from JSON
  {
    public int? ID { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? Category { get; set; }
    public string? Image {get; set; }
  }

  public class AppUserSeederDTO
  {
    public bool IsGuest { get; set; }

    public Guid? Id { get; set; }
    public Guid? GuestID { get; set; }
    public string? Email {get; set;}
    public bool EmailConfirmed { get; set; }
    //public string? PasswordHash { get; set; }
    public string? SecurityStamp { get; set; }
    public string? PhoneNumber { get; set; }
    public bool PhoneNumberConfirmed {get; set; }
    public bool TwoFactorEnabled { get; set; }
    public Double? LockoutEndDateUtc { get; set; }
    public bool LockoutEnabled { get; set; }
    public Int32 AccessFailedCount { get; set; }
    public string? UserName { get; set; }

    public string? Picture { get; set; }
  }

  public class OrderSeederDTO
  {
    public Guid? UserID { get; set; }
    public Guid? GuestID { get; set; }
    public Int32? ID { get; set; }
    public string OrderPlacedDate { get; set; }
    public string PaymentReceivedDate { get; set; }
    public string ReadyToShipDate { get; set; }
    public string ShipDate { get; set; }
    public string ReceivedDate { get; set; }
    public string? BillingAddress { get; set; }
    public string? ShippingAddress { get; set; }
    public string? OrderStatus { get; set; }
  }

  public class OrderedProductSeederDTO
  {
    public Int32? ID { get; set; }
    public Int32 Quantity { get; set; }
    public Int32? OrderID { get; set; }
    public Int32? InStockProductID { get; set; }
  }

  public class OrderPaymentSeederDTO
  {
    public Int32? ID { get; set; }
    public Int32? OrderID { get; set; }
    public Decimal? Amount { get; set; }
    public DateTimeOffset? Date { get; set; }
  }

  public class DataSeeder
  {
    private IConfiguration _config;
    private StoreContext _context;

    private Microsoft.AspNetCore.Identity.UserManager<AppUser> _userManager;
    private Microsoft.AspNetCore.Identity.RoleManager<IdentityRole> _roleManager;

    protected RandomUserMeApiClient _userMeService;
    //public static List<UserDTO> usermeDTOs;

    public static ILookupNormalizer _normalizer;
    public static IPasswordHasher<AppUser> _hasher;

    private static string? _hashedVipPassword;

    public static List<AppUserSeederDTO> appUserDTOs;
    public static IList<AppUser> AppUsers;

    public static IDictionary<string, Guest> Guests;

    public static List<InStockProductSeederDTO> inStockDTOs;
    public static IList<InStockProduct> InStockProducts;

    public static List<OrderSeederDTO> orderDTOs;
    public static IList<Order> Orders;

    public static List<OrderedProductSeederDTO> orderedProductDTOs;
    public static IList<OrderedProduct> OrderedProducts;

    public static List<OrderPaymentSeederDTO> orderPaymentDTOs;
    public static IList<OrderPayment> OrderPayments;

    public DataSeeder(
      StoreContext ctx,
      IConfiguration config,
      Microsoft.AspNetCore.Identity.UserManager<AppUser> um,
      Microsoft.AspNetCore.Identity.RoleManager<IdentityRole> rm,
      ILookupNormalizer norm,
      RandomUserMeApiClient userMeService
    )
    {
      _context = ctx;
      _config = config;
      _userManager = um;
      _roleManager = rm;
      _normalizer = norm;
      _userMeService = userMeService;
    }

    public async Task Execute()
    {
      //usermeDTOs = await _userMeService.GetUsersAsync();

      Console.WriteLine("Begin transaction for data seeding...");
      await using IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        await Seed();
        await transaction.CommitAsync();
        Console.WriteLine("Data seeded successfully within a transaction.");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        Console.WriteLine($"Error seeding data: {ex.Message}");
      }
    }

    private async Task Seed()
    {
      // We want to keep CartLine records, and Guest records. All other tables can be cleared.
        
      // Delete all rows for the tables we are recreating...
      _context.OrderPayments.RemoveRange(_context.OrderPayments);
      _context.OrderedProducts.RemoveRange(_context.OrderedProducts);
      _context.InStockProducts.RemoveRange(_context.InStockProducts);
      _context.Orders.RemoveRange(_context.Orders);
      _context.Users.RemoveRange(_context.Users);
      _context.Guests.RemoveRange(_context.Guests);
      _context.SaveChanges();

      Guests = new Dictionary<string, Guest>();

      // Add the VIP AppUser
      string vipUserName = _config.GetSection("Authentication:VIP:UserName").Value;
      string vipPassword = _config.GetSection("Authentication:VIP:Password").Value;
      IPasswordHasher hasher = new PasswordHasher();
      _hashedVipPassword = hasher.HashPassword(vipPassword);

      // Seed Roles
      string[] roleNames = { "Admin" };
      //string[] roleNames = { "Admin", "User" }; // Other user types can be added here, eg "Customer"
      foreach (var roleName in roleNames)
      {
        if (!await _roleManager.RoleExistsAsync(roleName)){
          await _roleManager.CreateAsync(new IdentityRole(roleName));
        }
      }

      // Seed User
      AppUser vipAppUser = new AppUser{
        Id = _config.GetSection("Authentication:VIP:Id").Value,
        UserName = vipUserName,
        PasswordHash = _hashedVipPassword,
        //IsGuest = _config.GetSection("Authentication:VIP:IsGuest").Value,
        Email = _config.GetSection("Authentication:VIP:Email").Value,
        EmailConfirmed = Boolean.Parse(_config.GetSection("Authentication:VIP:EmailConfirmed").Value),
        //SecurityStamp = _config.GetSection("Authentication:VIP:SecurityStamp").Value, // Allow database to set this value.
        PhoneNumber = _config.GetSection("Authentication:VIP:PhoneNumber").Value,
        PhoneNumberConfirmed = Boolean.Parse(_config.GetSection("Authentication:VIP:PhoneNumberConfirmed").Value),
        TwoFactorEnabled = Boolean.Parse(_config.GetSection("Authentication:VIP:TwoFactorEnabled").Value),
        //LockoutEndDateUtc = _config.GetSection("Authentication:VIP:LockoutEndDateUtc").Value,
        LockoutEnabled = Boolean.Parse(_config.GetSection("Authentication:VIP:LockoutEnabled").Value),
        AccessFailedCount = Int32.Parse(_config.GetSection("Authentication:VIP:AccessFailedCount").Value),
      };

      try
      {
        // Populate Users
        // [RwaspDatabase].[dbo].[AspNetUsers] does not need us to set IDENTITY_INSERT on, as it already allows PK insertion.
        // [RwaspDatabase].[dbo].[Guests]      does not need us to set IDENTITY_INSERT on, as it already allows PK insertion.
        AppUsers = new List<AppUser> { vipAppUser }; _context.Users.Add(vipAppUser); _context.SaveChanges();
        appUserDTOs = _config.GetSection("users").Get<List<AppUserSeederDTO>>();
        for (int u = 0; u < 39; u++) { SeedAppUsers(u); }
      }
      catch (Exception ex)
      {
        Debug.WriteLine(ex.Message);
      }

      // Populate Orders
      try
      {
        await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [RwaspDatabase].[dbo].[Orders] ON;");
        Orders = new List<Order>();
        orderDTOs = _config.GetSection("orders").Get<List<OrderSeederDTO>>();
        for (int oidx = 0; oidx < 70; oidx++) { SeedOrders(oidx); }
        await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [RwaspDatabase].[dbo].[Orders] OFF;");
      }
      catch(Exception ex)
      {
        Debug.WriteLine(ex.Message);
      }

      // Populate InStockProducts
      try
      {
        await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [RwaspDatabase].[dbo].[InStockProducts] ON;");
        InStockProducts = new List<InStockProduct>();
        inStockDTOs = _config.GetSection("instockproducts").Get<List<InStockProductSeederDTO>>();
        for (int pIdx = 0; pIdx < 27; pIdx++) { SeedInStockProducts(pIdx); }
        await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [RwaspDatabase].[dbo].[InStockProducts] OFF;");
      }
      catch (Exception ex)
      {
        Debug.WriteLine(ex.Message);
      }

      // Populate OrderedProducts
      try
      {
        await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [RwaspDatabase].[dbo].[OrderedProducts] ON;");
        OrderedProducts = new List<OrderedProduct>();
        orderedProductDTOs = _config.GetSection("orderedproducts").Get<List<OrderedProductSeederDTO>>();
        for (int idx = 0; idx < 200; idx++) { SeedOrderedProduct(idx); }
        await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [RwaspDatabase].[dbo].[OrderedProducts] OFF;");
      }
      catch (Exception ex)
      {
        Debug.WriteLine(ex.Message);
      }

      // Populate OrderPayments
      try
      {
        await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [RwaspDatabase].[dbo].[OrderPayments] ON;");
        OrderPayments = new List<OrderPayment>();
        orderPaymentDTOs = _config.GetSection("orderpayments").Get<List<OrderPaymentSeederDTO>>();
        for (int idx = 0; idx < 46; idx++) { SeedOrderPayment(idx); }
        await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT [RwaspDatabase].[dbo].[OrderPayments] OFF;");
      }
      catch (Exception ex)
      {
        Debug.WriteLine(ex.Message);
      }

      // Finished adding records.
    }


    private static DateTimeOffset? GetLockoutUtcDaysFromNow(Double? days)
    {
      return (days == null) ? (DateTimeOffset?)null : (DateTimeOffset.UtcNow.AddDays(Double.Parse(days.ToString() ?? string.Empty)));
    }

    private string? SpliceUsermeEmail(string thisName, string intoThisAddy)
    {
      string? name = thisName.Split('@')[0];
      string? email = intoThisAddy.Split('@')[1];
      return name + "@" + email;
    }

    private void SeedAppUsers(int u)
    {
      AppUserSeederDTO dto = appUserDTOs[u];
      //UserDTO usermeDto = usermeDTOs[u];
      string[] splitName = dto.UserName.Split(" ");
      Guest? guest = null;
      AppUser user = new AppUser
      {
        Id = dto.Id.ToString() ?? string.Empty,
        GuestID = dto.GuestID,
        Guest = guest,
        Email = dto.Email, //  SpliceUsermeEmail(usermeDto.Email, dto.Email),
        EmailConfirmed = dto.EmailConfirmed,
        PasswordHash = _hashedVipPassword,
        //SecurityStamp = dto.SecurityStamp, // Allow database to generate this.
        PhoneNumber = dto.PhoneNumber,
        PhoneNumberConfirmed = dto.PhoneNumberConfirmed,
        TwoFactorEnabled = dto.TwoFactorEnabled,
        LockoutEnd = GetLockoutUtcDaysFromNow(dto.LockoutEndDateUtc),
        LockoutEnabled = true, // "opt in" to lockout functionality. This does not mean the user is locked out.
        AccessFailedCount = dto.AccessFailedCount,
        UserName = dto.UserName, // usermeDto.Name.First + " " + usermeDto.Name.Last,
        //NormalizedUserName = _normalizer.NormalizeName(splitName[0] + "-" + splitName[1]),
        //NormalizedEmail = _normalizer.NormalizeEmail(dto.Email),

        //Picture = (usermeDto.Picture == null) ? string.Empty : usermeDto.Picture.Large   // Use Large picture from randomuserme
        Picture = (dto.Picture == null) ? string.Empty : dto.Picture
      };
      if (dto.IsGuest)
      {
        guest = new Guest
        {
          ID = (Guid)dto.GuestID,
          Email = user.Email,
          FirstName = splitName[0], // usermeDto.Name.First,
          LastName  = splitName[1]  // usermeDto.Name.Last
        };
        Guests.Add(user.Id.ToString(), guest);
        _context.Guests.Add(guest);
      }
      AppUsers.Add(user);
      _context.Users.Add(user);
      _context.SaveChanges();
    }

    private void SeedInStockProducts(int idx){
      InStockProductSeederDTO dto = inStockDTOs[idx];
      InStockProduct prod = new InStockProduct{
        ID = (Int32)dto.ID,
        Title = dto.Name,
        Description = dto.Description,
        Price = (decimal)dto.Price,
        Category = ProductCategory.ParseCat(dto.Category),
        Image = dto.Image
      };
      InStockProducts.Add(prod);
      _context.InStockProducts.Add(prod);
      _context.SaveChanges();
    }

    private static Nullable<DateTimeOffset> GetOrderDateTime(string input){
      try{
        return (Nullable<DateTimeOffset>)DateTimeOffset.Parse(input);
      }
      catch (FormatException e){
        return null;
      }
    }

    private void SeedOrders(int oidx)
    {
      OrderSeederDTO dto = orderDTOs[oidx];

      Guid? userId = dto.UserID;
      Guid? guestId = dto.GuestID;

      AppUser? user = AppUsers.FirstOrDefault( u => (Guid.Parse(u.Id) == userId) || ((userId == null) && (u.GuestID == guestId)) );
      Guest guest; Guests.TryGetValue(user.Id ?? string.Empty, out guest);

      Order order = new Order
      {
        ID = dto.ID,
        OrderPlacedDate = GetOrderDateTime(dto.OrderPlacedDate),
        PaymentReceivedDate = GetOrderDateTime(dto.PaymentReceivedDate),
        ReadyToShipDate = GetOrderDateTime(dto.ReadyToShipDate),
        ShipDate = GetOrderDateTime(dto.ShipDate),
        ReceivedDate = GetOrderDateTime(dto.ReceivedDate),
        BillingAddress = dto.BillingAddress ?? string.Empty,
        ShippingAddress = dto.ShippingAddress ?? string.Empty,
        OrderStatus = dto.OrderStatus ?? string.Empty,
      };
      if (guest != null)
      {
        order.Guest = guest;
        order.GuestID = guest.ID;
      }
      else
      {
        order.AppUser = user; // AppUsers.First(u => Int32.Parse(u.Id) == userId);
        order.UserID = userId.ToString();
      }
      Orders.Add(order);
      _context.Orders.Add(order);
      _context.SaveChanges();
    }

    private void SeedOrderedProduct(int idx)
    {
      OrderedProductSeederDTO dto = orderedProductDTOs[idx];

      InStockProduct isp = InStockProducts.FirstOrDefault(p => p.ID == dto.InStockProductID); // lookup navigation object
      Order order = Orders.FirstOrDefault(o => o.ID == dto.OrderID);                          // lookup navigation object
      OrderedProduct op = new OrderedProduct
      {
        ID = dto.ID,
        Order = order,        // OrderID = dto.OrderID,
        InStockProduct = isp, // InStockProductID = dto.InStockProductID,
        Quantity = dto.Quantity
      };
      OrderedProducts.Add(op);
      _context.OrderedProducts.Add(op);
      _context.SaveChanges();
    }

    private void SeedOrderPayment(int idx)
    {
      OrderPaymentSeederDTO dto = orderPaymentDTOs[idx];

      Order order = Orders.FirstOrDefault(o => o.ID == dto.OrderID); // lookup navigation object
      OrderPayment payment = new OrderPayment
      {
        ID = dto.ID,
        Order = order,
        OrderID = dto.OrderID,
        Amount = dto.Amount,
        Date = (DateTimeOffset)dto.Date
      };
      OrderPayments.Add(payment);
      _context.OrderPayments.Add(payment);
      _context.SaveChanges();
    }
  }
}
