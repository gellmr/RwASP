using Microsoft.AspNetCore.Identity;
using ReactWithASP.Server.Domain;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactWithASP.Server.Infrastructure
{
  public class AppUser: IdentityUser
  {
    public virtual ICollection<Order> Orders { get; set; }

    [ForeignKey("GuestID")]
    public virtual Guest Guest { get; set; } // Navigation property.
    public Guid? GuestID { get; set; }

    public string? Picture { get; set; } // Fetched from randomuser.me during seed on start

    public string? FullName { get; set; } // The display name. Custom property can contain spaces.

    public void updateFullName(string? fullName)
    {
      if (string.IsNullOrWhiteSpace(fullName)){
        throw new ArgumentException("Empty name");
      }
      if (string.IsNullOrEmpty(fullName)){
        throw new ArgumentException("Empty name");
      }
      FullName = fullName;
    }
  }
}
