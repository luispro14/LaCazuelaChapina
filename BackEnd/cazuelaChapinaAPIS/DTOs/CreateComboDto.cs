namespace cazuelaChapinaAPIS.DTOs
{
    public class CreateComboDto
    {
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public bool IsSeasonal { get; set; }

        public List<CreateComboItemDto> Items { get; set; } = new();
    }

    public class CreateComboItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }



}
