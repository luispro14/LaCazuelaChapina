namespace cazuelaChapinaAPIS.DTOs
{
    public class CreateOrderDto
    {
        public string? CustomerName { get; set; }
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }

    public class CreateOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        public List<AttributeSelectionDto> Selections { get; set; } = new();
    }

    public class AttributeSelectionDto
    {
        public int ProductAttributeId { get; set; }
        public int ProductAttributeValueId { get; set; }
    }

}
