﻿using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Controllers
{
  public abstract class LoginController: ShopController
  {
    protected SignInManager<AppUser> _signInManager;
    protected UserManager<AppUser> _userManager;
    protected IConfiguration _config;

    public LoginController(
      ICartLineRepository cartRepo,
      IGuestRepository guestRepo,
      IInStockRepository inStockRepo,
      IConfiguration config,
      UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager
    ): base(cartRepo, guestRepo, inStockRepo)
    {
      _config = config;
      _userManager = userManager;
      _signInManager = signInManager;
    }
  }
}
