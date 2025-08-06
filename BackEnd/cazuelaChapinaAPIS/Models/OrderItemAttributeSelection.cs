namespace cazuelaChapinaAPIS.Models
{
    public class OrderItemAttributeSelection
    {
        public int Id { get; set; }

        public int OrderItemId { get; set; }
        public OrderItem? OrderItem { get; set; }

        public int ProductAttributeId { get; set; }
        public ProductAttribute? ProductAttribute { get; set; }

        public int ProductAttributeValueId { get; set; }
        public ProductAttributeValue? ProductAttributeValue { get; set; }
    }

}
