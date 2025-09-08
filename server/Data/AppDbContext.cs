using Microsoft.EntityFrameworkCore;
using server.BO.Auth;
using server.BO.Todo;
using server.BO.User;

namespace server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserBO> Users { get; set; }
        public DbSet<TodoBO> Todos { get; set; }
        public DbSet<RefreshTokenBO> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // map table
            modelBuilder.Entity<UserBO>().ToTable("pm_users", "masterdata");
            modelBuilder.Entity<RefreshTokenBO>().ToTable("pm_refreshtokens", "masterdata");
            modelBuilder.Entity<TodoBO>().ToTable("pm_todos", "data");
        }
    }
}
