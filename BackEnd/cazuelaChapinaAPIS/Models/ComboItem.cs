using System.Text.Json.Serialization;

namespace cazuelaChapinaAPIS.Models
{
    public class ComboItem
    {
        public int Id { get; set; }

        public int ComboId { get; set; }
        [JsonIgnore]
        public Combo? Combo { get; set; } = default!;

        public int ProductId { get; set; }
        [JsonIgnore]
        public Product? Product { get; set; } = default!;

        public int Quantity { get; set; }
    }
}
