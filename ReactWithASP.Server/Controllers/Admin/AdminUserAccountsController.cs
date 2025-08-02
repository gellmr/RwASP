using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.DTO.AdminUserAccounts;
using System.Security.Claims;

namespace ReactWithASP.Server.Controllers.Admin
{
  [Authorize]
  [ApiController]
  [Route("api")]
  public class AdminUserAccountsController : AdminBaseController
  {
    protected RandomUserMeApiClient _userMeService;
    protected IHostEnvironment _hostingEnvironment;
    private IConfiguration _config;

    public AdminUserAccountsController(UserManager<AppUser> userManager, RandomUserMeApiClient userMeService, IHostEnvironment hostingEnv, IConfiguration config) : base (userManager)
    {
      _userMeService = userMeService;
      _hostingEnvironment = hostingEnv;
      _config = config;
    }

    [HttpGet("admin-useraccounts")]
    public async Task<ActionResult> GetUserAccounts()
    {
      try
      {
        // Grab the current user id from claims of the currently logged in user.
        string currentUserId = (User.Identity.IsAuthenticated) ? User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;

        IEnumerable<UserDTO> users = _userManager.Users
          .ToList()
          .OrderBy(user => user.Id == currentUserId ? 0 : 1) // Make the currently logged in user appear FIRST in the sorted list.
          .ThenBy(user => user.PhoneNumber)                  // The rest of the list is sorted by phone number.
          .Select( u => new UserDTO{
            Email = u.Email,
            EmailConfirmed = u.EmailConfirmed,
            GuestID = u.GuestID,
            Id = u.Id,
            PhoneNumber = u.PhoneNumber,
            PhoneNumberConfirmed = u.PhoneNumberConfirmed,
            Picture = u.Picture,
            UserName = u.UserName,
          });

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
        bool isDev = _hostingEnvironment.EnvironmentName.Equals("Development");
        string UploadProfilePic = _config.GetSection("UploadProfilePic").Value;

        // The "userpic" upload folder is within the SPA folder, which is located:
        //    ..\reactwithasp.client\public\userpic    (development)
        //    .\wwwroot\userpic                        (production)
        // So we find the content root path of the server application...
        //    C:\path\to\RwASP\ReactWithASP.Server  (development)
        //    C:\path\to\RwASP-wwwroot              (production)
        // And check if we are running in development mode...
        //    C:\path\to\RwASP\ReactWithASP.Server
        //    C:\path\to\RwASP <-- go up. Then append SPA path fragment
        //    C:\path\to\RwASP\reactwithasp.client\public\userpic
        // But for production there is no need to go up
        //    C:\path\to\RwASP-wwwroot   (Append SPA path fragment)
        //    C:\path\to\RwASP-wwwroot\wwwroot\userpic
        string uploadsFolder = Path.Combine(_hostingEnvironment.ContentRootPath, UploadProfilePic);
        if (isDev){
          uploadsFolder = Path.Combine(Directory.GetParent(_hostingEnvironment.ContentRootPath).FullName, UploadProfilePic);
        }

        if (!Directory.Exists(uploadsFolder)){
          Directory.CreateDirectory(uploadsFolder);
        }
        var ext = Path.GetExtension(file.FileName);
        var uniqueFileName = "userpic_" + Guid.NewGuid().ToString() + ext; // eg "userpic_854595........................cb38c7.png"
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
        
        // Save to file system
        using (var stream = new FileStream(filePath, FileMode.Create)){
          await file.CopyToAsync(stream);
        }

        string pathToSave = "/userpic/" + uniqueFileName; // Relative to SPA root.

        // Get the currently logged in user by Id.
        AppUser currentUser = await EnsureAppUser();
        currentUser.Picture = pathToSave;
        await _userManager.UpdateAsync(currentUser);

        // Respond with JSON including URL for the uploaded file.
        return this.StatusCode(StatusCodes.Status200OK, new {
          Message = "File uploaded successfully",
          Picture = pathToSave,
          userId = currentUser.Id,
          debug = uploadsFolder  // Will be either C:\\path\\to\\RwASP\\reactwithasp.client\\public\\userpic   or   C:\\path\\to\\RwASP-wwwroot\\wwwroot\\userpic
        });
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
      }
    }
  }
}
