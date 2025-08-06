using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace cazuelaChapinaAPIS.Models
{

    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //Usuarios
        public DbSet<User> Users { get; set; }

        //Productos
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductAttribute> ProductAttributes { get; set; }
        public DbSet<ProductAttributeValue> ProductAttributeValues { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Combos
                modelBuilder.Entity<ComboItem>()
                .HasOne(ci => ci.Combo)
                .WithMany(c => c.Items)
                .HasForeignKey(ci => ci.ComboId);

            modelBuilder.Entity<ComboItem>()
                .HasOne(ci => ci.Product)
                .WithMany()
                .HasForeignKey(ci => ci.ProductId);

            //Inventarios
            modelBuilder.Entity<InventoryMovement>()
            .HasOne(m => m.InventoryItem)
            .WithMany(i => i.Movements)
            .HasForeignKey(m => m.InventoryItemId)
            .OnDelete(DeleteBehavior.Cascade);

            // Order -> OrderItem
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderItem -> Product
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderItemAttributeSelection -> OrderItem (Cascade está bien aquí)
            modelBuilder.Entity<OrderItemAttributeSelection>()
                .HasOne(s => s.OrderItem)
                .WithMany(oi => oi.Selections)
                .HasForeignKey(s => s.OrderItemId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderItemAttributeSelection -> ProductAttribute (evita cascada múltiple)
            modelBuilder.Entity<OrderItemAttributeSelection>()
                .HasOne(s => s.ProductAttribute)
                .WithMany()
                .HasForeignKey(s => s.ProductAttributeId)
                .OnDelete(DeleteBehavior.Restrict); // o .NoAction

            // OrderItemAttributeSelection -> ProductAttributeValue (evita cascada múltiple)
            modelBuilder.Entity<OrderItemAttributeSelection>()
                .HasOne(s => s.ProductAttributeValue)
                .WithMany()
                .HasForeignKey(s => s.ProductAttributeValueId)
                .OnDelete(DeleteBehavior.Restrict); // o .NoAction

            modelBuilder.Entity<InventoryItem>(entity =>
            {
                entity.Property(e => e.CostPerUnit).HasColumnType("decimal(18,2)");
            });
        }



        //Pedidos
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderItemAttributeSelection> OrderItemAttributeSelections { get; set; }


        //Combos

        public DbSet<Combo> Combos { get; set; }
        public DbSet<ComboItem> ComboItems { get; set; }


        //Inventario
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<InventoryMovement> InventoryMovements { get; set; }


    }
}
