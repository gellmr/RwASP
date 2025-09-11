﻿using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Infrastructure;
using ReactWithASP.Server.DTO.AdminUserAccounts;
using System.Security.Claims;
using Microsoft.AspNet.Identity;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.DTO;

namespace ReactWithASP.Server.Controllers.Admin
{
  public class AdminUserAccountsController : AdminBaseController
  {
    protected RandomUserMeApiClient _userMeService;
    protected IHostEnvironment _hostingEnvironment;
    private IConfiguration _config;

    public AdminUserAccountsController(Microsoft.AspNetCore.Identity.UserManager<AppUser> userManager, RandomUserMeApiClient userMeService, IHostEnvironment hostingEnv, IConfiguration config, IGuestRepository gRepo) : base (userManager, gRepo)
    {
      _userMeService = userMeService;
      _hostingEnvironment = hostingEnv;
      _config = config;
    }

    [HttpPost]
    [Route("admin-guest-update")]
    public ActionResult UpdateGuest([FromBody] UserDTO userUpdate)
    {
      try
      {
        // Look up Guest, update name and email, save
        _guestRepo.UpdateWithTransaction(new GuestUpdateDTO{
          ID        = (Guid)userUpdate.GuestID,
          Email     = userUpdate.Email,
          FirstName = MyExtensions.GetFirstName(userUpdate.FullName),
          LastName  = MyExtensions.getLastName(userUpdate.FullName),
          Picture   = userUpdate.Picture,
        });
        return this.StatusCode(StatusCodes.Status200OK, new { Message = "Success updating guest", Persist = userUpdate });
      }
      catch (GuestUpdateException ex)
      {
        UserDTO? revert = UserDTO.TryParse(ex.Original);
        return this.StatusCode(StatusCodes.Status400BadRequest, new { Message = ex.Message, Revert = revert });
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, new { Message = ex.Message });
      }
    }

    [HttpPost]
    [Route("admin-user-update")]
    public async Task<ActionResult> UpdateUser([FromBody] UserDTO userUpdate)
    {
      UserDTO? revert = null;
      try
      {
        // Update user
        AppUser appUser = await _userManager.FindByIdAsync(userUpdate.Id);
        revert = UserDTO.TryParse(appUser);
        appUser.updateFullName(userUpdate.FullName);
        appUser.PhoneNumber = userUpdate.PhoneNumber;
        appUser.Email = userUpdate.Email;
        var result = await _userManager.UpdateAsync(appUser);
        if (!result.Succeeded){
          throw new ArgumentException("Could not save appUser. errors: " + result.Errors.ToString());
        }
        return this.StatusCode(StatusCodes.Status200OK, new { Message = "Success updating user", Persist = userUpdate });
      }
      catch (Exception ex){
        return this.StatusCode(StatusCodes.Status400BadRequest, new { Message = ex.Message, Revert = revert });
      }
    }

    [HttpGet("admin-useraccounts")]
    public ActionResult GetUserAccounts()
    {
      try
      {
        // Grab the current user id from claims of the currently logged in user.
        string currentUserId = (User.Identity.IsAuthenticated) ? User.FindFirstValue(ClaimTypes.NameIdentifier) : string.Empty;

        AppUser? curr = _userManager.Users.FirstOrDefault(user => user.Id == currentUserId);
        UserDTO currentUser = UserDTO.TryParse(curr);

        List<UserDTO> appUsers = _userManager.Users
          .Where(u => u.Id != currentUserId)
          .OrderBy(user => user.PhoneNumber)                  // The rest of the list is sorted by phone number.
          .Select( u => UserDTO.TryParse(u))
          .ToList();

        List<Guest> dguests = _guestRepo.Guests.Where(g =>
          !string.IsNullOrEmpty(g.Email) &&
          !string.IsNullOrEmpty(g.FirstName)
        ).ToList();

        List<UserDTO> guests = dguests.Select(u => new UserDTO{
          Email = u.Email,
          GuestID = u.ID,
          Id = null,
          Picture = u.Picture,
          UserName = MyExtensions.GenUserName(u.FullName, u.ID.ToString().ToLower()),
          FullName = u.FullName
        })
        .OrderBy(u => u.FullName)
        .ToList();

        List<UserDTO> allUsers = [currentUser, // Ensure current user appears at top
          .. guests,   // Show guests above users
          .. appUsers, // Show users
        ];

        return Ok(allUsers);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }

    [HttpGet("admin-guest-edit/{idval}")]
    public ActionResult GetGuestAccount(string? idval)
    {
      try
      {
        // Ensure the given gid string is equivalent to a Guid
        if (!PcreValidation.ValidString(idval, MyRegex.AppUserOrGuestId)){
          return this.StatusCode(StatusCodes.Status400BadRequest, "Invalid gid");
        }
        idval = (idval == null) ? null : idval.ToLower();
        Guest? g = _guestRepo.Guests.FirstOrDefault(g => g.ID.ToString().ToLower().Equals(idval));
        UserDTO user = UserDTO.TryParse(g);
        return Ok(user);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }

    [HttpGet("admin-user-edit/{idval}")]
    public async Task<ActionResult> GetUserAccount(string? idval)
    {
      try
      {
        // Ensure the given uid is either an AppUserId (Guid) or a Google Subject Id (20-255 numeric value)
        if ( !(PcreValidation.ValidString(idval, MyRegex.AppUserOrGuestId) || PcreValidation.ValidString(idval, MyRegex.GoogleSubject))){
          return this.StatusCode(StatusCodes.Status400BadRequest, "Invalid uid");
        }
        AppUser? u = await _userManager.FindByIdAsync(idval);
        UserDTO user = UserDTO.TryParse(u);
        return Ok(user);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status400BadRequest, ex.Message);
      }
    }

    [HttpPost("admin-userpic")]
    [DisableRequestSizeLimit] // Optional: disables the default file size limit
    public async Task<ActionResult> PostUserImage(IFormFile file, string? idval, string? usertype)
    {
      try
      {
        if (!(PcreValidation.ValidString(idval, MyRegex.AppUserOrGuestId) || PcreValidation.ValidString(idval, MyRegex.GoogleSubject))){
          return this.StatusCode(StatusCodes.Status400BadRequest, "Invalid idval");
        }
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

        // Get the user or guest that we are updating...
        string? idsave = null;
        if (!string.IsNullOrEmpty(usertype) && usertype == "guest")
        {
          // Look up Guest, update picture, save
          Guid gid = Guid.Parse(idval);
          await _guestRepo.UpdateWithTransaction(new GuestUpdateDTO{ ID = gid, Picture = pathToSave });
          idsave = gid.ToString().ToLower();
        }
        else
        {
          AppUser userToSave = await _userManager.FindByIdAsync(idval);
          userToSave.Picture = pathToSave;
          var result = await _userManager.UpdateAsync(userToSave);
          if (!result.Succeeded){
            throw new Exception("Could not save user. " + result.Errors.First().Description);
          }
          idsave = userToSave.Id;
        }

        // Respond with JSON including URL for the uploaded file.
        return this.StatusCode(StatusCodes.Status200OK, new {
          Message = "File uploaded successfully",
          Picture = pathToSave,
          idsave = idsave,       // Id of the user or guest to save on client.
          debug = uploadsFolder  // Will be either C:\\path\\to\\RwASP\\reactwithasp.client\\public\\userpic   or   C:\\path\\to\\RwASP-wwwroot\\wwwroot\\userpic
        });
      }
      catch (GuestUpdateException ex)
      {
        UserDTO? revert = UserDTO.TryParse(ex.Original);
        return this.StatusCode(StatusCodes.Status400BadRequest, new { Message = ex.Message, Revert = revert });
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
      }
    }
  }
}
