using cazuelaChapinaAPIS.DTOs;
using cazuelaChapinaAPIS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cazuelaChapinaAPIS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductAttributeValueController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductAttributeValueController(AppDbContext context)
        {
            _context = context;
        }

        // Crear nueva opción/valor para un atributo
        [HttpPost]
        public async Task<IActionResult> CreateValue([FromBody] ProductAttributeValue value)
        {
            _context.ProductAttributeValues.Add(value);
            await _context.SaveChangesAsync();
            return Ok(value);
        }

        // Obtener valores por atributo
        [HttpGet("by-attribute/{attributeId}")]
        public async Task<IActionResult> GetValuesByAttribute(int attributeId)
        {
            var values = await _context.ProductAttributeValues
                .Where(v => v.ProductAttributeId == attributeId)
                .ToListAsync();

            return Ok(values);
        }
    }

}
