using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ReactWithASP.Server.Infrastructure
{
  public class CustomMigrator
  {
    StoreContext Context;
    string ContentRootPath;
    IConfiguration Configuration;
    DataSeeder Seeder;

    public CustomMigrator(StoreContext context, IHostEnvironment env, IConfiguration config, DataSeeder seeder)
    {
      Context = context;
      ContentRootPath = env.ContentRootPath;
      Configuration = config;
      Seeder = seeder;
    }

    public async Task Execute()
    {
      try
      {
        await Context.Database.MigrateAsync();
      }
      catch (Exception ex)
      {
        // An error occurred while migrating / seeding.
        // Migrations might not all have completed.
      }
    }
  }
}

