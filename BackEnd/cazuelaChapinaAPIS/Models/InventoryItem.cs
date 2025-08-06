using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace cazuelaChapinaAPIS.Models
{


    public class InventoryItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Category { get; set; }

        [Required]
        public string Unit { get; set; }

        public decimal StockQuantity { get; set; }

        public decimal CostPerUnit { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<InventoryMovement>? Movements { get; set; }
    }

    public class InventoryMovement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int InventoryItemId { get; set; }
        public InventoryItem? InventoryItem { get; set; }

        [Required]
        public decimal Quantity { get; set; } // + entrada, - salida

        [Required]
        public string MovementType { get; set; } 

        [Required]
        public DateTime Date { get; set; }

        public decimal CostTotal { get; set; }

        public string Notes { get; set; }
    }
}
