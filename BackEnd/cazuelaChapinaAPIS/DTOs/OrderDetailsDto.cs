namespace cazuelaChapinaAPIS.DTOs
{
    public class OrderDetailsDto
    {
        public int Id { get; set; }
        public string? CustomerName { get; set; }
        public DateTime CreatedAt { get; set; }

        public decimal Total { get; set; }
        public List<OrderItemDetailsDto> Items { get; set; } = new();
    }

    public class OrderItemDetailsDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }  // <-- Asegúrate de tener esto
        public decimal Subtotal { get; set; }
        public List<AttributeSelectionDetailsDto> Selections { get; set; } = new();
    }

    public class AttributeSelectionDetailsDto
    {

        public string ProductAttributeName { get; set; } = "";
        public string ProductAttributeValueName { get; set; } = "";
    }
}
