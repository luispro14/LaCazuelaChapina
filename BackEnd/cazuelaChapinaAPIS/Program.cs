using Microsoft.EntityFrameworkCore;
using cazuelaChapinaAPIS.Models; // Asegúrate de que esta sea la ruta correcta a tu AppDbContext
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;



var builder = WebApplication.CreateBuilder(args);

// Configura CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // URL de tu frontend React, asegúrate de usar la URL correcta
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configura el DbContext para usar SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cazuela Chapina API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Ingrese el token JWT",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// JWT Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };

        // Para poder ver los errores de validación del token JWT
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                // Aquí puedes hacer un logging si el token es inválido
                Console.WriteLine("Token no válido: " + context.Exception.Message);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configurar el pipeline de solicitud HTTP
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cazuela Chapina API v1");
    c.RoutePrefix = string.Empty; // Esto hace que Swagger UI esté disponible en la raíz
});

// Usar CORS
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthentication(); // Primero autenticación
app.UseAuthorization();  // Luego autorización

app.MapControllers();

app.Run();
