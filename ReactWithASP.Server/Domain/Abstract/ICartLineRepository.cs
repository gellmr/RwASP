namespace ReactWithASP.Server.Domain.Abstract
{
  public interface ICartLineRepository
  {
    CartLine? SaveCartLine(CartLine cartLine);
    void ClearCartLines(Nullable<Guid> guestID);
    IEnumerable<CartLine> CartLines { get; }
  }
}
