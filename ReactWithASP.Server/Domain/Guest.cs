using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ReactWithASP.Server.Domain
{
  public class Guest
  {
    [Key]
    public Guid ID { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Picture { get; set; }
    public virtual IList<Order> Orders { get; set; }

    [NotMapped]
    public string FullName {
      get {
        if (string.IsNullOrEmpty(FirstName) && string.IsNullOrEmpty(LastName)){
          return string.Empty; // Both empty
        }
        else if (string.IsNullOrEmpty(LastName)){ return FirstName; // FirstName available
        }
        else if (string.IsNullOrEmpty(FirstName)){ return LastName; // LastName available
        }
        else{ return FirstName + " " + LastName; // Both available.
        }
      }
    }

    // Update firstname/lastname, given a string like "Eileen Ryan"
    public void updateFullName(string? fullName)
    {
      if (string.IsNullOrWhiteSpace(fullName)){
        throw new ArgumentException("Empty name");
      }
      if (string.IsNullOrEmpty(fullName)){
        throw new ArgumentException("Empty name");
      }
      string[] names = fullName.Trim().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
      if (names.Length > 0){
        FirstName = names[0];
      }
      // Assign the remaining parts to the last name
      if (names.Length > 1){
        LastName = string.Join(" ", names, 1, names.Length - 1);
      }
      else{
        LastName = string.Empty;
      }
    }
  }
}
