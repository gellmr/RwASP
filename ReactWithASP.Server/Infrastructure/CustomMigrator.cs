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

    public CustomMigrator(StoreContext context, IHostEnvironment env, IConfiguration config)
    {
      Context = context;
      ContentRootPath = env.ContentRootPath;
      Configuration = config;
    }

    public async Task Execute()
    {
      try
      {
        var deployMarker = Path.Combine(ContentRootPath, "deploy_marker.txt");
        if (File.Exists(deployMarker))
        {
          if (bool.Parse(Configuration["OnStart:Migrate"]))
          {
            var migrator = Context.GetInfrastructure().GetService<IMigrator>();
            List<string> pendingMigrations = (await Context.Database.GetPendingMigrationsAsync()).ToList();
            foreach (string pending in pendingMigrations)
            {
              await migrator.MigrateAsync(pending);
            }
          }
          File.Delete(deployMarker);
        }
      }
      catch (Exception ex)
      {
        // An error occurred while migrating the database
      }
    }
  }
}
