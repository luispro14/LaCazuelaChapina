namespace cazuelaChapinaAPIS.Models
{
    public class ProductAttribute
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int ProductId { get; set; }
        public Product? Product { get; set; }  // No Required

        public ICollection<ProductAttributeValue>? Options { get; set; } = new List<ProductAttributeValue>();
    }

}
