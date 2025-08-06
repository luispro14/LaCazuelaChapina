using cazuelaChapinaAPIS.DTOs;
using cazuelaChapinaAPIS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cazuelaChapinaAPIS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var order = new Order
            {
                CustomerName = dto.CustomerName,
                CreatedAt = DateTime.UtcNow,
                Items = new List<OrderItem>()
            };

            foreach (var itemDto in dto.Items)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null)
                {
                    return NotFound($"Producto con ID {itemDto.ProductId} no encontrado.");
                }

                var orderItem = new OrderItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price,
                    Subtotal = product.Price * itemDto.Quantity,
                    Selections = itemDto.Selections.Select(sel => new OrderItemAttributeSelection
                    {
                        ProductAttributeId = sel.ProductAttributeId,
                        ProductAttributeValueId = sel.ProductAttributeValueId
                    }).ToList()
                };

                order.Items.Add(orderItem);
            }

            // Calcular total (opcional)
            order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { order.Id });
        }




        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailsDto>> GetById(int id)
        {
            var order = await _context.Orders
                .Where(o => o.Id == id)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Selections)
                        .ThenInclude(s => s.ProductAttribute)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Selections)
                        .ThenInclude(s => s.ProductAttributeValue)
                .FirstOrDefaultAsync();

            if (order == null) return NotFound();

            var result = new OrderDetailsDto
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                CreatedAt = order.CreatedAt,
                Total = order.Total, // <-- Esto
                Items = order.Items.Select(i => new OrderItemDetailsDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,     // <-- Esto
                    Subtotal = i.Subtotal,       // <-- Esto
                    Selections = i.Selections.Select(s => new AttributeSelectionDetailsDto
                    {
                        ProductAttributeName = s.ProductAttribute.Name,
                        ProductAttributeValueName = s.ProductAttributeValue.Value
                    }).ToList()
                }).ToList()
            };


            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDetailsDto>>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Selections)
                        .ThenInclude(s => s.ProductAttribute)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Selections)
                        .ThenInclude(s => s.ProductAttributeValue)
                .ToListAsync();

            if (orders == null || !orders.Any())
                return NotFound();

            var result = orders.Select(order => new OrderDetailsDto
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                CreatedAt = order.CreatedAt,
                Total = order.Total,
                Items = order.Items.Select(i => new OrderItemDetailsDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Subtotal = i.Subtotal,
                    Selections = i.Selections.Select(s => new AttributeSelectionDetailsDto
                    {
                        ProductAttributeName = s.ProductAttribute.Name,
                        ProductAttributeValueName = s.ProductAttributeValue.Value
                    }).ToList()
                }).ToList()
            }).ToList();

            return Ok(result);
        }




    }

}
