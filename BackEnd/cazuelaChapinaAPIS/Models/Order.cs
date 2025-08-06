namespace cazuelaChapinaAPIS.Models
{
    public class Order
    {
        public int Id { get; set; }

        public string? CustomerName { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public decimal Total { get; set; }

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

}
