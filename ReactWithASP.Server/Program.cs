using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;

// -------------------------------------------------------------
// Add Services to the DI container.

var builder = WebApplication.CreateBuilder(args);

IHostEnvironment env = builder.Environment;

// Load either Development or Production JSON config. (Not in source control)
builder.Configuration.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);

// Configure SQL Server to always use an execution strategy with retries.
builder.Services.AddDbContext<StoreContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("StoreContext"),
        sqlServerOptionsAction: sqlOptions =>
        {
          sqlOptions.EnableRetryOnFailure(
              maxRetryCount: 10,
              maxRetryDelay: TimeSpan.FromSeconds(30),
              errorNumbersToAdd: null); // You can specify specific error numbers here
        })
);
builder.Services.AddTransient<DataSeeder>();

builder.Services.AddIdentity<AppUser, IdentityRole>(options => { 
  options.SignIn.RequireConfirmedAccount = true;
  options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(1); // Default is 5 minutes
  options.Lockout.AllowedForNewUsers = true; // "Opt in" to using the lockout functionality. True does not mean the user is locked out.
})
.AddEntityFrameworkStores<StoreContext>()
.AddSignInManager<SignInManager<AppUser>>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
  options.Cookie.HttpOnly   = true; // Prevents client-side script access
  options.ExpireTimeSpan    = TimeSpan.FromMinutes(60);
  options.LoginPath         = "/admin";
  options.AccessDeniedPath  = "/admin";
  options.SlidingExpiration = true;
  options.Cookie.Name = MyExtensions.IdentityCookieName;
});

builder.Services.AddControllers();

// Enable Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
  options.Cookie.HttpOnly    = true;
  options.Cookie.IsEssential = true;
});

builder.Services.AddAuthentication(options =>{
  options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme; 
  options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie(options => {
  options.Cookie.Name = MyExtensions.IdentityCookieName;
})
.AddGoogle(options => {
  // Get Google tokens from config...
  options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
  options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
});

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register custom authorization middleware handler with DI container
builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, CustomAuthorizationMiddlewareResultHandler>();

// Random User Generator API to fetch a list of (generated) user data for development projects. Use seed to ensure same results.
builder.Services.AddHttpClient<RandomUserMeApiClient>(client =>{
  client.BaseAddress = new Uri(RandomUserMeApiClient.BaseAddress);
  client.DefaultRequestHeaders.Add("Accept", "application/json");
});

// DI declarations
builder.Services.AddScoped<IOrdersRepository, EFOrdersRepository>();
builder.Services.AddScoped<ICartLineRepository, EFCartLineRepository>();
builder.Services.AddScoped<IInStockRepository, EFInStockRepository>();
builder.Services.AddScoped<IGuestRepository, EFGuestRepository>();
builder.Services.AddScoped<StoreContext, StoreContext>();
builder.Services.AddScoped<MyEnv, MyEnv>();

// -------------------------------------------------------------

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.MapControllers();

// Create database if does not exist, and apply pending migrations. Run seed data.
using (var scope = app.Services.CreateScope()){
  var services = scope.ServiceProvider;
  try{
    var context = services.GetRequiredService<StoreContext>();
    if (env.EnvironmentName == "Development" || env.EnvironmentName == "Test"){
      await context.Database.MigrateAsync();
    }
    // If SeedOnStart is true, and deploy marker exists, then perform seeding and delete marker file.
    var seedMarkerPath = Path.Combine(app.Environment.ContentRootPath, "deploy_marker.txt");
    bool execSeed = bool.Parse(builder.Configuration["SeedOnStart"]);
    if (false && execSeed && File.Exists(seedMarkerPath)){
      var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
      await seeder.Execute();
      File.Delete(seedMarkerPath);
    }

    // Convert one line addresses into dto objects.
    //var ordersRepository = services.GetRequiredService<IOrdersRepository>();
    //AddressParser addressParser = new AddressParser(ordersRepository, context);
    //await addressParser.Execute();
  }
  catch (Exception ex){
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred while migrating the database.");
  }
}

app.MapFallbackToFile("/index.html");
app.Run();