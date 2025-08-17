using Microsoft.EntityFrameworkCore.Storage;
using ReactWithASP.Server.DTO;

namespace ReactWithASP.Server.Domain.Abstract
{
  public interface IGuestRepository
  {
    IEnumerable<Guest> Guests { get; }
    IDbContextTransaction BeginTransaction();
    void SaveGuest(Guest guest);
    Nullable<Guid> GuestExists(string email);
    public Guest? UpdateWithTransaction(GuestUpdateDTO dto);
  }
}
