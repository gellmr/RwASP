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
  }

  public class AppUserSeederDTO
  {
    public bool IsGuest { get; set; }

    public string Id { get; set; }
    public string? Email {get; set;}
    public bool EmailConfirmed { get; set; }
    //public string? PasswordHash { get; set; }
    public string? SecurityStamp { get; set; }
    public string? PhoneNumber { get; set; }
    public bool PhoneNumberConfirmed {get; set; }
    public bool TwoFactorEnabled { get; set; }
    public DateTimeOffset? LockoutEndDateUtc { get; set; }
    public bool LockoutEnabled { get; set; }
    public Int32 AccessFailedCount { get; set; }
    public string? UserName { get; set; }
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
    public static IList<AppUser> appUsers;

    public static List<InStockProductSeederDTO> inStockDTOs;
    public static IList<InStockProduct> inStockProducts;


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
      // We want to keep CartLine records, and Guest records. All other tables can be cleared.

      // Delete all rows for the tables we are recreating...
      _context.Users.RemoveRange(_context.Users);
      _context.InStockProducts.RemoveRange(_context.InStockProducts);
      //_context.OrderedProducts.RemoveRange(_context.OrderedProducts);
      //_context.OrderPayments.RemoveRange(_context.OrderPayments);
      //_context.Orders.RemoveRange(_context.Orders);

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
      if (await _userManager.FindByIdAsync(vipAppUser.Id) == null){
        await _userManager.CreateAsync(vipAppUser);
        await _userManager.AddToRoleAsync(vipAppUser, "Admin");
      }
      //var regularUser = new IdentityUser { UserName = "user@example.com", Email = "user@example.com", EmailConfirmed = true };
      //if (await userManager.FindByEmailAsync(regularUser.Email) == null){
      //  await userManager.CreateAsync(regularUser);
      //  await userManager.AddToRoleAsync(regularUser, "User");
      //}

      // ------------------------------------------------------------

      // Populate InStockProducts
      inStockDTOs = _config.GetSection("instockproducts").Get<List<InStockProductSeederDTO>>();
      inStockProducts = new List<InStockProduct>();
      for ( int pIdx = 0; pIdx < 27; pIdx++ ){ SeedInStockProducts(pIdx); }
      _context.InStockProducts.AddRange(inStockProducts.ToArray());

      // Populate Users
      appUserDTOs = _config.GetSection("users").Get<List<AppUserSeederDTO>>();
      appUsers = new List<AppUser>();
      for (int u = 1; u < 40; u++) { SeedAppUsers(u); }
      _context.Users.AddRange(appUsers.ToArray());

      // All done.
      await _context.SaveChangesAsync();
    }
    
    private static void SeedAppUsers(int u)
    {
      try
      {
        AppUserSeederDTO dto = appUserDTOs[u];
        string[] splitName = dto.UserName.Split(" ");
        AppUser user = new AppUser
        {
          Id = dto.Id,
          Email = dto.Email,
          EmailConfirmed = dto.EmailConfirmed,
          PasswordHash = _hashedVipPassword,
          //SecurityStamp = dto.SecurityStamp, // Allow database to generate this.
          PhoneNumber = dto.PhoneNumber,
          PhoneNumberConfirmed = dto.PhoneNumberConfirmed,
          TwoFactorEnabled = dto.TwoFactorEnabled,
          LockoutEnd = dto.LockoutEndDateUtc,
          LockoutEnabled = true, // "opt in" to lockout functionality. This does not mean the user is locked out.
          AccessFailedCount = dto.AccessFailedCount,
          UserName = dto.UserName,
          NormalizedUserName = _normalizer.NormalizeName(splitName[0] + "-" + splitName[1]),
          NormalizedEmail = _normalizer.NormalizeEmail(dto.Email)
        };
        appUsers.Add(user);
      }
      catch (ArgumentOutOfRangeException rangeEx)
      {
        // did not have expected data in seed file
      }
    }

    private static void SeedInStockProducts(int idx){
      InStockProductSeederDTO dto = inStockDTOs[idx];
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
