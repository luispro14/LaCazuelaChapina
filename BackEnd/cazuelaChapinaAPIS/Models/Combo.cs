namespace cazuelaChapinaAPIS.Models
{
    public class Combo
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public decimal Price { get; set; }

        public bool IsSeasonal { get; set; } = false;

        public ICollection<ComboItem>? Items { get; set; }
    }
}
