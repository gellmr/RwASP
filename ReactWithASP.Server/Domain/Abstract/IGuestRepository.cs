namespace ReactWithASP.Server.Domain.Abstract
{
  public interface IGuestRepository
  {
    IEnumerable<Guest> Guests { get; }
    void SaveGuest(Guest guest);
    Nullable<Guid> GuestExists(string email);
  }
}
