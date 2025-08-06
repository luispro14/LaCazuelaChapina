using System.ComponentModel.DataAnnotations;

namespace cazuelaChapinaAPIS.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; } // guardo hash, no la contraseña
    }

    public class RegisterRequest
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

}
