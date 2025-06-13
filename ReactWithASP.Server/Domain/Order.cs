using System.ComponentModel.DataAnnotations;

namespace ReactWithASP.Server.Domain
{
  public class Order
  {
    [Key]
    public Nullable<Int32> ID { get; set; }
    public virtual IList<OrderedProduct> OrderedProducts { get; set; }

    public Order()
    {
      ID = null;
      OrderedProducts = new List<OrderedProduct>();
    }
  }
}
