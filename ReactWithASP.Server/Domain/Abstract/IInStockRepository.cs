namespace ReactWithASP.Server.Domain.Abstract
{
  public interface IInStockRepository
  {
    IEnumerable<InStockProduct> InStockProducts { get; }
  }
}
