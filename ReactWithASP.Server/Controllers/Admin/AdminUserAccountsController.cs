using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace ReactWithASP.Server.Controllers.Admin
{
  [Authorize]
  [ApiController]
  [Route("api")]
  public class AdminUserAccountsController : AdminBaseController
  {
    protected UserManager<AppUser> _userManager;
    protected RandomUserMeApiClient _userMeService;
    protected IHostEnvironment _hostingEnvironment;

    public AdminUserAccountsController(UserManager<AppUser> userManager, RandomUserMeApiClient userMeService, IHostEnvironment hostingEnv)
    {
      _userManager = userManager;
      _userMeService = userMeService;
      _hostingEnvironment = hostingEnv;
    }

    [HttpGet("admin-useraccounts")]
    public async Task<ActionResult> GetUserAccounts()
    {
      try
      {
        IEnumerable<AppUser> users = _userManager.Users
          .ToList()
          .OrderBy(user => user.PhoneNumber);

        return Ok(users);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }

    [HttpPost("admin-userpic")]
    [DisableRequestSizeLimit] // Optional: disables the default file size limit
    public async Task<ActionResult> PostUserImage(IFormFile file)
    {
      try
      {
        if (file == null || file.Length == 0){
          return this.StatusCode(StatusCodes.Status400BadRequest, "No file was uploaded");
        }
        // Save to 'uploads' folder in wwwroot directory.
        var uploadsFolder = Path.Combine(_hostingEnvironment.ContentRootPath, "uploads");
        if (!Directory.Exists(uploadsFolder)){
          Directory.CreateDirectory(uploadsFolder);
        }
        var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        // Save to file system
        using (var stream = new FileStream(filePath, FileMode.Create)){
          await file.CopyToAsync(stream);
        }
        return this.StatusCode(StatusCodes.Status200OK, "File uploaded successfully");
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
      }
    }
  }
}
