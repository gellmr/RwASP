using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;

// -------------------------------------------------------------
// Add Services to the container

var builder = WebApplication.CreateBuilder(args);

IHostEnvironment env = builder.Environment;

// Load either Development or Production JSON config. (Not in source control)
builder.Configuration.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);

builder.Services.AddDbContext<StoreContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("StoreContext")));
builder.Services.AddTransient<DataSeeder>();

builder.Services.AddIdentity<AppUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = true)
       .AddEntityFrameworkStores<StoreContext>()
       .AddDefaultTokenProviders();

builder.Services.AddControllers();

// Enable Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
  options.Cookie.HttpOnly = true; // This makes the cookie readable only by our server. Client side javascript cannot read the cookie. Protects against XSS.
  options.Cookie.IsEssential = true;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DI declarations
builder.Services.AddScoped<IOrdersRepository, EFOrdersRepository>();
builder.Services.AddScoped<ICartLineRepository, EFCartLineRepository>();
builder.Services.AddScoped<IInStockRepository, EFInStockRepository>();
builder.Services.AddScoped<IGuestRepository, EFGuestRepository>();
builder.Services.AddScoped<StoreContext, StoreContext>();

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

using (var scope = app.Services.CreateScope())
{
  var services = scope.ServiceProvider;
  var context = services.GetRequiredService<StoreContext>();
  context.Database.EnsureDeleted();
  context.Database.EnsureCreated(); // Create the database if it doesnt exist.
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseSession();

app.MapControllers();

using (var scope = app.Services.CreateScope()){
  var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
  seeder.Seed();
}

app.MapFallbackToFile("/index.html");

app.Run();
