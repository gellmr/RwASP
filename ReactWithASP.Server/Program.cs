using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
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

builder.Services.AddDbContext<StoreContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("StoreContext")));
builder.Services.AddTransient<DataSeeder>();

builder.Services.AddIdentity<AppUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = true)
       .AddEntityFrameworkStores<StoreContext>() // This adds UserStore and RoleStore. If you don't use it you have
                                                 // to provide Stores yourself with AddUserStore and AddRoleStore.
       .AddDefaultTokenProviders();              // This adds token providers for features like password reset and email confirmation.



builder.Services.AddControllers(); // In ASP.NET Core, you should call AddControllers() before AddAuthorization()

// Enable Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
  options.Cookie.HttpOnly = true; // This makes the cookie readable only by our server. Client side javascript cannot read the cookie. Protects against XSS.
  options.Cookie.IsEssential = true;
});

// Enable Google login for .NET Identity.
// Specify that we want to use cookie authentication. This means the session ID is maintained in a
// cookie, to verify the user is logged in (without needing to re-authenticate on every page load).
builder.Services.AddAuthentication(options =>
{
  // If you have two authentication schemes, "Cookies" and "JWT", and you configure DefaultAuthenticateScheme as "JWT",
  // then requests that don't specify an authentication scheme will be authenticated (in the [Authorize] attribute) using the JWT scheme.
  // If you ALSO configure DefaultScheme as "Cookies", then operations like signing in or signing out will default to the cookie scheme.
  //   I want to use cookies as the default scheme for both, and optionally specify in my requests when I'm using Google sign in.
  //   Here we are specifying that we want to use cookie authentication as the default authentication scheme.
  //   Eg when we decorate our Controllers with [Authorize] we are saying we want them to use cookie authentication.
  //   We are also specifying to use cookies as the default scheme for operations like signing in and out.
  options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
  options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;

  // Specify that we want to create a cookie containing the user's identity, when they successfully sign in.
  options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;

  // When the user tries to access a resource that requires authorization (401 unauthorized) we Challenge them
  // which takes them to login page and then redirects back to the resource they wanted.
  // Specify that we should use cookie authentication as the default for this situation.
  options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;

  //options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie( options => options.LoginPath = "/admin" )
.AddGoogle( options => { // Get Google tokens from config...
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; // Use the same scheme as AddCookie
  }
);
builder.Services.AddAuthorization();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DI declarations
builder.Services.AddScoped<IOrdersRepository, EFOrdersRepository>();
builder.Services.AddScoped<ICartLineRepository, EFCartLineRepository>();
builder.Services.AddScoped<IInStockRepository, EFInStockRepository>();
builder.Services.AddScoped<IGuestRepository, EFGuestRepository>();
builder.Services.AddScoped<IAppUserRepo, AppUserRepo>();
builder.Services.AddScoped<StoreContext, StoreContext>();
builder.Services.AddScoped<MyEnv, MyEnv>();

// -------------------------------------------------------------
// Configure the HTTP Request pipeline

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

bool useSeed = false;
using (var scope = app.Services.CreateScope()){
  var services = scope.ServiceProvider;
  var context = services.GetRequiredService<StoreContext>();
  context.Database.EnsureDeleted();
  useSeed = context.Database.EnsureCreated(); // Create the database if it doesnt exist.
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapControllers();

using (var scope = app.Services.CreateScope()){
  if(useSeed){
    var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
    seeder.Seed();
  }
}

app.MapFallbackToFile("/index.html");

app.Run();
