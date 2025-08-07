using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Infrastructure;
using ReactWithASP.Server.DTO.AdminUserAccounts;
using System.Security.Claims;
using Microsoft.AspNet.Identity;
using System.Text.Json;
using ReactWithASP.Server.Domain.Abstract;

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
    protected IGuestRepository _guestRepo;

    public AdminUserAccountsController(Microsoft.AspNetCore.Identity.UserManager<AppUser> userManager, RandomUserMeApiClient userMeService, IHostEnvironment hostingEnv, IConfiguration config, IGuestRepository gRepo) : base (userManager)
    {
      _userMeService = userMeService;
      _hostingEnvironment = hostingEnv;
      _config = config;
      _guestRepo = gRepo;
    }

    [HttpPost]
    [Route("admin-user-update")]
    public async Task<ActionResult> UpdateUser([FromBody] UserDTO userUpdate)
    {
      AppUser original = null;
      try
      {
        AppUser appUser = await _userManager.FindByIdAsync(userUpdate.Id);
        original = JsonSerializer.Deserialize<AppUser>(JsonSerializer.Serialize(appUser));
        appUser.FullName = userUpdate.FullName;
        appUser.PhoneNumber = userUpdate.PhoneNumber;
        appUser.Email = userUpdate.Email;
        await _userManager.UpdateAsync(appUser);
        return this.StatusCode(StatusCodes.Status200OK, new { Message = "Success updating user", Persist = userUpdate });
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, new { Message = ex.Message, Revert = original });
      }
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
            FullName = u.FullName
          });

        return Ok(users);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }

    [HttpGet("admin-user-edit/{uid}")]
    public async Task<ActionResult> GetUserAccount(string? uid)
    {
      try
      {
        // Ensure the given uid is either an AppUserId (Guid) or a Google Subject Id (20-255 numeric value)
        if ( !(PcreValidation.ValidString(uid, MyRegex.AppUserOrGuestId) || PcreValidation.ValidString(uid, MyRegex.GoogleSubject))){
          return this.StatusCode(StatusCodes.Status400BadRequest, "Invalid uid");
        }
        AppUser? u = await _userManager.FindByIdAsync(uid);
        UserDTO user = new UserDTO{
          Email = u.Email,
          EmailConfirmed = u.EmailConfirmed,
          GuestID = u.GuestID,
          Id = u.Id,
          PhoneNumber = u.PhoneNumber,
          PhoneNumberConfirmed = u.PhoneNumberConfirmed,
          Picture = u.Picture,
          UserName = u.UserName,
          FullName = u.FullName
        };
        return Ok(user);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }

    [HttpPost("admin-userpic")]
    [DisableRequestSizeLimit] // Optional: disables the default file size limit
    public async Task<ActionResult> PostUserImage(IFormFile file, string? uid)
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
        AppUser userToSave = await _userManager.FindByIdAsync(uid);
        userToSave.Picture = pathToSave;
        var result = await _userManager.UpdateAsync(userToSave);
        if (!result.Succeeded){
          throw new Exception("Could not save user. " + result.Errors.First().Description);
        }

        // Respond with JSON including URL for the uploaded file.
        return this.StatusCode(StatusCodes.Status200OK, new {
          Message = "File uploaded successfully",
          Picture = pathToSave,
          userId = userToSave.Id,
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
