using ReactWithASP.Server.Domain.Abstract;
using ReactWithASP.Server.Infrastructure;

namespace ReactWithASP.Server.Domain
{
  public class EFInStockRepository : IInStockRepository
  {
    private readonly IConfiguration _config;
    private StoreContext context;

    public EFInStockRepository(IConfiguration c)
    {
      _config = c;
      context = new StoreContext(_config);
    }

    public IEnumerable<InStockProduct> InStockProducts
    {
      get { return context.InStockProducts; }
    }
  }
}
