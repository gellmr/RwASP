namespace ReactWithASP.Server.Domain.Abstract
{
  public interface ICartLineRepository
  {
    Int32? SaveCartLine(CartLine cartLine);
    void ClearCartLines(Nullable<Guid> guestID);
    IEnumerable<CartLine> CartLines { get; }
  }
}
