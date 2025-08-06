using System.Text.Json.Serialization;

namespace cazuelaChapinaAPIS.Models
{
    public class ProductAttributeValue
    {
        public int Id { get; set; }
        public string Value { get; set; }

        public int ProductAttributeId { get; set; }
        public ProductAttribute? ProductAttribute { get; set; }
    }

}
