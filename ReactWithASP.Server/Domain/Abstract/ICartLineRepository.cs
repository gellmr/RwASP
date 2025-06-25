namespace ReactWithASP.Server.Domain.Abstract
{
  public interface ICartLineRepository
  {
    CartLine? SaveCartLine(CartLine cartLine);
    void ClearCartLines(Nullable<Guid> guestID);
    void RemoveById(Int32 cartLineIdRem);
    IEnumerable<CartLine> CartLines { get; }
  }
}
