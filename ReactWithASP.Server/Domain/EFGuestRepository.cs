using Microsoft.EntityFrameworkCore.Storage;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Domain
{
  public class EFGuestRepository: IGuestRepository
  {
    private readonly IConfiguration _config;
    private StoreContext context;

    public EFGuestRepository(IConfiguration c){
      _config = c;
      context = new StoreContext(_config);
    }
    
    public IDbContextTransaction BeginTransaction(){
      return context.Database.BeginTransaction();
    }

    public IEnumerable<Guest> Guests
    {
      get
      {
        IEnumerable<Guest> guests = context.Guests.Where(g => g.ID != null); // Email, FirstName and LastName are allowed to be null.
        return guests;
      }
    }

    public void SaveGuest(Guest guest)
    {
      if (context.Guests.Any(g => g.ID == guest.ID))
      {
        // Record already exists. Update
        Guest dbEntry = context.Guests.FirstOrDefault(g => g.ID == guest.ID);
        dbEntry.ID = guest.ID;
        dbEntry.Email = guest.Email;
        dbEntry.FirstName = guest.FirstName;
        dbEntry.LastName = guest.LastName;
        dbEntry.Picture = guest.Picture;
        context.SaveChanges();
      }else{
        // Create new record
        context.Guests.Add(guest);
        context.SaveChanges();
      }
    }


    public Nullable<Guid> GuestExists(string email)
    {
      Guest guest = context.Guests.FirstOrDefault(g => g.Email.Equals(email));
      if (guest != null)
      {
        return (Nullable<Guid>)guest.ID;
      }
      return null;
    }
  }
}
