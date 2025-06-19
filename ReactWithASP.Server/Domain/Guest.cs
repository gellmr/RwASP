using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ReactWithASP.Server.Domain
{
  public class Guest
  {
    [Key]
    public Nullable<Guid> ID { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public virtual IList<Order> Orders { get; set; }

    [NotMapped]
    public string FullName {
      get {
        return FirstName + " " + LastName;
      }
    }
  }
}
