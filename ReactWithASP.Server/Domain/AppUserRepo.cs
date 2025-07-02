using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Domain
{
  public class AppUserRepo : IAppUserRepo
  {
    private readonly IConfiguration _config;
    private readonly UserManager<AppUser> _userManager;
    private StoreContext context;

    public AppUserRepo(IConfiguration c, UserManager<AppUser> um)
    {
      _config = c;
      _userManager = um;
      context = new StoreContext(_config);
    }

    public async Task<AppUser?> SaveGoogleAppUser(GoogleAppUserDTO googleAppUser)
    {
      // Use the native .NET Core Identity classes to add record.
      AppUser? appUser = new AppUser {
        UserName = googleAppUser.Subject,
        Email = googleAppUser.Email,
      };
      IdentityResult result = await _userManager.CreateAsync(appUser); // Dont store password.
      if (result.Succeeded){
        return appUser;
      }
      return null;
    }

    public async Task<AppUser?> FindAppUserById(string userId)
    {
      AppUser? user = await _userManager.FindByIdAsync(userId);
      return user;
    }
  }
}
