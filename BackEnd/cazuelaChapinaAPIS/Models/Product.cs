using System.Text.Json.Serialization;

namespace cazuelaChapinaAPIS.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public decimal Price { get; set; }

        public ICollection<ProductAttribute>? ProductAttributes { get; set; } = new List<ProductAttribute>();
    }

}
