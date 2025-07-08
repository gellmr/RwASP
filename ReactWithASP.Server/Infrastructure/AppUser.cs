using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactWithASP.Server.Infrastructure
{
  public class AppUser: IdentityUser
  {
    public virtual ICollection<Order> MyOrders { get; set; }
    
    [NotMapped]
    public Guid? GuestID { get; set; }
  }
}
