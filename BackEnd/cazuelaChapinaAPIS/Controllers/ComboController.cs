using cazuelaChapinaAPIS.Models;
using cazuelaChapinaAPIS.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace cazuelaChapinaAPIS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComboController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ComboController(AppDbContext context) => _context = context;


        [HttpPost]
        public async Task<IActionResult> CreateCombo([FromBody] Combo combo)
        {
            combo.Id = 0; // forzar id 0 para que EF Core lo trate como nuevo
            _context.Combos.Add(combo);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Combo creado correctamente", comboId = combo.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCombo(int id, [FromBody] Combo combo)
        {
            if (id != combo.Id)
            {
                return BadRequest(new { message = "El ID del combo no coincide con el parámetro de la URL." });
            }

            var existingCombo = await _context.Combos.FindAsync(id);

            if (existingCombo == null)
            {
                return NotFound(new { message = "Combo no encontrado." });
            }

            // Actualizar los campos necesarios
            existingCombo.Description = combo.Description;
            existingCombo.Price = combo.Price;
            // Agrega más campos si es necesario

            _context.Combos.Update(existingCombo);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Combo actualizado correctamente", comboId = existingCombo.Id });
        }

        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ComboItem updatedItem)
        {
            if (id != updatedItem.Id)
            {
                return BadRequest("El ID del item no coincide con el parámetro de la URL.");
            }

            var existingItem = await _context.ComboItems.FindAsync(id);
            if (existingItem == null)
            {
                return NotFound("Item del combo no encontrado");
            }

            // Validar que el combo aún existe
            var combo = await _context.Combos.FindAsync(updatedItem.ComboId);
            if (combo == null)
            {
                return NotFound("Combo no encontrado");
            }

            // Actualizar campos del item
            existingItem.ProductId = updatedItem.ProductId;
            existingItem.Quantity = updatedItem.Quantity;
            // Agrega más campos si tu modelo tiene otros atributos

            _context.ComboItems.Update(existingItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item del combo actualizado correctamente", itemId = existingItem.Id });
        }


        [HttpGet("{id}")]
            public async Task<IActionResult> GetCombo(int id)
            {
                var combo = await _context.Combos.Include(c => c.Items).FirstOrDefaultAsync(c => c.Id == id);
                if (combo == null) return NotFound();
                return Ok(combo);
            }

            [HttpPost("items")]
            public async Task<IActionResult> AddItem([FromBody] ComboItem item)
            {
                var combo = await _context.Combos.FindAsync(item.ComboId);
                if (combo == null) return NotFound("Combo no encontrado");

                _context.ComboItems.Add(item);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCombo), new { id = item.ComboId }, item);
            }
        







        [HttpGet]
        public async Task<ActionResult<IEnumerable<Combo>>> GetAll() =>
            await _context.Combos.Include(c => c.Items).ThenInclude(i => i.Product).ToListAsync();
    }

}
