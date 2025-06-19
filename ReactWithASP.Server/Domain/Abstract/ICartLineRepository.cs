namespace ReactWithASP.Server.Domain.Abstract
{
  public interface ICartLineRepository
  {
    void SaveCartLine(CartLine cartLine);
    void ClearCartLines(Nullable<Guid> guestID);
    IEnumerable<CartLine> CartLines { get; }
  }
}
