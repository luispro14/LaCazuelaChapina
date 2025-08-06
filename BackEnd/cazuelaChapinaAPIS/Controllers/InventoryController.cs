using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using System.Linq;
using cazuelaChapinaAPIS.Models;

namespace cazuelaChapinaAPIS.Controllers
{
    

    [ApiController]
    [Route("api/inventory")]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        public InventoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/inventory/items
        [HttpGet("items")]
        public async Task<IActionResult> GetItems()
        {
            var items = await _context.InventoryItems.ToListAsync();
            return Ok(items);
        }

        // POST api/inventory/items
        [HttpPost("items")]
        public async Task<IActionResult> CreateItem([FromBody] InventoryItem item)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            item.LastUpdated = DateTime.UtcNow;
            _context.InventoryItems.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetItems), new { id = item.Id }, item);
        }

        // GET api/inventory/movements
        [HttpGet("movements")]
        public async Task<IActionResult> GetMovements([FromQuery] int? itemId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.InventoryMovements.AsQueryable();

            if (itemId.HasValue)
                query = query.Where(m => m.InventoryItemId == itemId);

            if (startDate.HasValue)
                query = query.Where(m => m.Date >= startDate);

            if (endDate.HasValue)
                query = query.Where(m => m.Date <= endDate);

            var movements = await query.OrderByDescending(m => m.Date).ToListAsync();
            return Ok(movements);
        }

        // POST api/inventory/movements
        [HttpPost("movements")]
        public async Task<IActionResult> CreateMovement([FromBody] InventoryMovement movement)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = await _context.InventoryItems.FindAsync(movement.InventoryItemId);
            if (item == null)
                return NotFound($"Inventory item with Id {movement.InventoryItemId} not found.");

            // Actualizar stock
            item.StockQuantity += movement.Quantity; // sumamos entrada, restamos salida
            item.LastUpdated = DateTime.UtcNow;

            _context.InventoryMovements.Add(movement);
            _context.InventoryItems.Update(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMovements), new { id = movement.Id }, movement);
        }
    }

}
