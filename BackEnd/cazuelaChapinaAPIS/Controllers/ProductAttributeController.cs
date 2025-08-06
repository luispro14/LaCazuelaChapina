using cazuelaChapinaAPIS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cazuelaChapinaAPIS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductAttributeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductAttributeController(AppDbContext context)
        {
            _context = context;
        }

        // Crear un nuevo atributo para un producto
        [HttpPost]
        public async Task<IActionResult> CreateAttribute([FromBody] ProductAttribute attribute)
        {
            _context.ProductAttributes.Add(attribute);
            await _context.SaveChangesAsync();
            return Ok(attribute);
        }

        // Obtener todos los atributos
        [HttpGet]
        public async Task<IActionResult> GetAttributes()
        {
            var attributes = await _context.ProductAttributes.ToListAsync();
            return Ok(attributes);
        }
    }

}
