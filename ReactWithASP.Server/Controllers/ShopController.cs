﻿using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Domain;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Controllers
{
  public abstract class ShopController : MyBaseController
  {
    protected enum UserType { Guest, AppUser, GoogleAppUser, None };

    protected IGuestRepository guestRepo;
    protected ICartLineRepository cartLineRepo;
    protected IInStockRepository inStockRepo;

    public ShopController(ICartLineRepository rRepo, IGuestRepository gRepo, IInStockRepository pRepo) {
      guestRepo = gRepo;
      cartLineRepo = rRepo;
      inStockRepo = pRepo;
    }

    protected Guest EnsureGuestIdFromCookie()
    {
      // See if guest id cookie exists...
      Guest guest = null;
      Nullable<Guid> guestId;
      bool createGuest = false;
      string cookieGuestId = Request.Cookies[MyExtensions.GuestCookieName];
      if (string.IsNullOrEmpty(cookieGuestId))
      {
        // Cookie value is not available
        createGuest = true;
        guestId = Guid.NewGuid(); // Create guest ID for the first time.
      }
      else
      {
        // Cookie value is available...
        guestId = cookieGuestId.ToNullableGuid();
        guest = guestRepo.Guests.FirstOrDefault(g => g.ID == guestId); // Look up guest in database.
        if (guest == null)
        {
          createGuest = true; // Record was not found in database.
        }
      }

      if (createGuest)
      {
        // Create guest record in database.
        guest = new Guest { ID = guestId };
        guestRepo.SaveGuest(guest);
      }

      // Store guest id in cookie...
      HttpContext.Response.Cookies.Delete(MyExtensions.GuestCookieName);
      Response.Cookies.Append(MyExtensions.GuestCookieName, guestId.ToString(), MyExtensions.CookieOptions);
      return guest;
    }
  }
}