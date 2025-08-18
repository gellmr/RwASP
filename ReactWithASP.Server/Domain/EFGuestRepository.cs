using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.DTO;
using ReactWithASP.Server.Infrastructure;
using System.Data;

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
    
    public async Task<IDbContextTransaction> BeginTransactionAsync(){
      return await context.Database.BeginTransactionAsync(IsolationLevel.Serializable);
    }

    // Must use IQueryable to support deferred execution in async methods
    public IQueryable<Guest> Guests
    {
      get
      {
        IQueryable<Guest> guests = context.Guests.Where(g => g.ID != null); // Email, FirstName and LastName are allowed to be null.
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

    public async Task<Guest?> UpdateWithTransaction(GuestUpdateDTO dto)
    {
      Guest? original = null;
      await using (var transaction = await context.Database.BeginTransactionAsync(IsolationLevel.Serializable))
      {
        try
        {
          // Look up Guest.
          Guest? guest = await Guests.FirstOrDefaultAsync(g => g.ID.Equals(dto.ID));

          if (guest == null)
          {
            // Create for the first time
            guest = new Guest
            {
              ID        = dto.ID,
              Email     = dto.Email,
              FirstName = dto.FirstName,
              LastName  = dto.LastName,
              Picture   = dto.Picture,
            };
            original = new Guest(guest);
            context.Guests.Add(guest);
          }
          else
          {
            // Update with incoming DTO values.
            original = new Guest(guest);
            guest.Email     = dto.Email     ?? guest.Email;
            guest.FirstName = dto.FirstName ?? guest.FirstName;
            guest.LastName  = dto.LastName  ?? guest.LastName;
            guest.Picture   = dto.Picture   ?? guest.Picture;
          }

          // Save to database
          await context.SaveChangesAsync();

          await transaction.CommitAsync();

          return guest;
        }
        catch (Exception ex)
        {
          await transaction.RollbackAsync();
          GuestUpdateException gError = new GuestUpdateException(ex.Message, ex.InnerException);
          gError.Original = original;
          throw gError;
        }
      }
    }
  }
}
