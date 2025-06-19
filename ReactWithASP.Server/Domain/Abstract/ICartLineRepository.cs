namespace ReactWithASP.Server.Domain.Abstract
{
  public interface ICartLineRepository
  {
    void SaveCartLine(CartLine cartLine);
    IEnumerable<CartLine> CartLines { get; }
  }
}
