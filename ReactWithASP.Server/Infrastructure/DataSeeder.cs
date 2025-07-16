using Microsoft.AspNet.Identity; // Provides PasswordHasher.
using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain;

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

    public Int32? Id { get; set; }
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
  }

  public class OrderSeederDTO
  {
    public Int32? UserID { get; set; }
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
      ILookupNormalizer norm
    )
    {
      _context = ctx;
      _config = config;
      _userManager = um;
      _roleManager = rm;
      _normalizer = norm;
    }

    public async Task Seed()
    {
      try
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
        /*
        if (await _userManager.FindByIdAsync(vipAppUser.Id) == null){
          await _userManager.CreateAsync(vipAppUser);
          await _userManager.AddToRoleAsync(vipAppUser, "Admin");
        }
        */
        //var regularUser = new IdentityUser { UserName = "user@example.com", Email = "user@example.com", EmailConfirmed = true };
        //if (await userManager.FindByEmailAsync(regularUser.Email) == null){
        //  await userManager.CreateAsync(regularUser);
        //  await userManager.AddToRoleAsync(regularUser, "User");
        //}

        // ------------------------------------------------------------

        // To preserve the order in which records are created (so we may predict Primary Key values eg 111, 112, 113...)
        // I had to call _context.SaveChanges() at every record, which is a performance hit - but this only runs once (each time we deploy).

        // Populate Users
        AppUsers = new List<AppUser> { vipAppUser }; _context.Users.Add(vipAppUser); _context.SaveChanges();
        appUserDTOs = _config.GetSection("users").Get<List<AppUserSeederDTO>>();
        for (int u = 0; u < 39; u++) { SeedAppUsers(u); }

        // Populate Orders
        Orders = new List<Order>();
        orderDTOs = _config.GetSection("orders").Get<List<OrderSeederDTO>>();
        for (int oidx = 0; oidx < 70; oidx++) { SeedOrders(oidx); }

        // Populate InStockProducts
        InStockProducts = new List<InStockProduct>();
        inStockDTOs = _config.GetSection("instockproducts").Get<List<InStockProductSeederDTO>>();
        for (int pIdx = 0; pIdx < 27; pIdx++) { SeedInStockProducts(pIdx); }

        // Populate OrderedProducts
        OrderedProducts = new List<OrderedProduct>();
        orderedProductDTOs = _config.GetSection("orderedproducts").Get<List<OrderedProductSeederDTO>>();
        for (int idx = 0; idx < 200; idx++) { SeedOrderedProduct(idx); }

        // Populate OrderPayments
        OrderPayments = new List<OrderPayment>();
        orderPaymentDTOs = _config.GetSection("orderpayments").Get<List<OrderPaymentSeederDTO>>();
        for (int idx = 0; idx < 46; idx++) { SeedOrderPayment(idx); }

        // All done.
      }
      catch (Exception ex)
      {
        int a = 1;
      }
    }


    private static DateTimeOffset? GetLockoutUtcDaysFromNow(Double? days)
    {
      return (days == null) ? (DateTimeOffset?)null : (DateTimeOffset.UtcNow.AddDays(Double.Parse(days.ToString() ?? string.Empty)));
    }

    private void SeedAppUsers(int u)
    {
      AppUserSeederDTO dto = appUserDTOs[u];
      string[] splitName = dto.UserName.Split(" ");
      Guest? guest = null;
      if (dto.IsGuest)
      {
        guest = new Guest
        {
          ID = dto.GuestID,
          Email = dto.Email,
          FirstName = splitName[0],
          LastName = splitName[1]
        };
        Guests.Add(dto.Id.ToString(), guest);
      }
      AppUser user = new AppUser
      {
        Id = dto.Id.ToString() ?? string.Empty, // This will be ignored when we save to the database and a generated Id will be assigned.
        GuestID = dto.GuestID,
        Guest = guest,
        Email = dto.Email,
        EmailConfirmed = dto.EmailConfirmed,
        PasswordHash = _hashedVipPassword,
        //SecurityStamp = dto.SecurityStamp, // Allow database to generate this.
        PhoneNumber = dto.PhoneNumber,
        PhoneNumberConfirmed = dto.PhoneNumberConfirmed,
        TwoFactorEnabled = dto.TwoFactorEnabled,
        LockoutEnd = GetLockoutUtcDaysFromNow(dto.LockoutEndDateUtc),
        LockoutEnabled = true, // "opt in" to lockout functionality. This does not mean the user is locked out.
        AccessFailedCount = dto.AccessFailedCount,
        UserName = dto.UserName,
        //NormalizedUserName = _normalizer.NormalizeName(splitName[0] + "-" + splitName[1]),
        //NormalizedEmail = _normalizer.NormalizeEmail(dto.Email)
      };
      AppUsers.Add(user);
      _context.Users.Add(user);
      _context.SaveChanges();
    }

    private void SeedInStockProducts(int idx){
      InStockProductSeederDTO dto = inStockDTOs[idx];
      InStockProduct prod = new InStockProduct{
        //ID = (Int32)dto.ID, // Allow database to assign a value.
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
      
      Int32? userId = dto.UserID;
      Guid? guestId = dto.GuestID;

      AppUser? user = AppUsers.FirstOrDefault( u => (Int32.Parse(u.Id) == userId) || ((userId == null) && (u.GuestID == guestId)) );
      Guest guest; Guests.TryGetValue(user.Id ?? string.Empty, out guest);

      Order order = new Order
      {
        //ID = dto.ID, // Allow database to assign a value
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
        //ID = dto.ID,
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
        //ID = dto.ID,
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
