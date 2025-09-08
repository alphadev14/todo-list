using System.Text;
using server.BLL.Todo;
using server.DAO.Todo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using server.Services;
using server.BLL.Auth;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DAO.Auth;

var builder = WebApplication.CreateBuilder(args);

// ================== Services ==================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Thêm authorize vào Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Nhập JWT token vào đây: Bearer {token}",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// ================== DB ==================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


// ========== CORS ==========
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ========== JWT Authentication ==========
var jwtKey = builder.Configuration["Jwt:Key"] ?? "super-secret-key-123";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "todo-api";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// ========== Dependency Injection ==========
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddSingleton<TodoDAO>();
builder.Services.AddScoped<TodoBLL>();
builder.Services.AddScoped<AuthBLL>();
builder.Services.AddScoped<AuthDAO>();

// ================== Build App ==================
var app = builder.Build();

// Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication(); // Quan trọng: phải đặt trước UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();


/* 🔑 3 loại lifetime trong DI
 * 1. Singleton
    + Tạo một instance duy nhất trong suốt vòng đời ứng dụng.
    + Tất cả request, tất cả user → đều dùng chung instance này.
    + Thường dùng cho:
        Config tĩnh, service không thay đổi state theo user.
        Ví dụ: logging service, cache tạm trong memory, DAO giả lập chưa có DB.

   2. Scoped
     + Tạo một instance cho mỗi request HTTP.
     + Cùng một request → tất cả chỗ inject sẽ dùng chung instance.
     + Request khác → tạo instance khác.
     + Thường dùng cho:
        BLL (business logic layer) → mỗi request cần xử lý riêng.
        Repository/DbContext (khi dùng Entity Framework).
    
    3. Transient
     + Mỗi lần inject → tạo instance mới.
     + Không giữ state gì cả.
     + Thường dùng cho:
        Service nhỏ, stateless, xử lý ngắn hạn.
        Helper, utility service.
 */