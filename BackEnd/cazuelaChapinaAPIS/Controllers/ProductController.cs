using cazuelaChapinaAPIS.Models;
using cazuelaChapinaAPIS.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cazuelaChapinaAPIS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los productos
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        // Obtener producto con atributos y opciones
        [HttpGet("{id}/attributes")]
        public async Task<IActionResult> GetProductWithAttributes(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductAttributes)
                    .ThenInclude(attr => attr.Options)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    productId = p.Id,
                    productName = p.Name,
                    attributes = p.ProductAttributes.Select(attr => new
                    {
                        attributeId = attr.Id,
                        attributeName = attr.Name,
                        options = attr.Options.Select(o => o.Value).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // Crear nuevo producto
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
        }
    }

}
