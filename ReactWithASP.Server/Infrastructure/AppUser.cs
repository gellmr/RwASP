using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain;

namespace ReactWithASP.Server.Infrastructure
{
  public class AppUser: IdentityUser
  {
    public virtual ICollection<Order> MyOrders { get; set; }
  }
}
