using Microsoft.EntityFrameworkCore;
using WatchSync.Api.Data;

namespace WatchSync.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

            // Erlaubte Frontend-Adressen aus Konfiguration lesen (mit localhost als Fallback)
            var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',')
                                 ?? new[] { "http://localhost:5173" };

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Migrations beim Start automatisch anwenden
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();
            }

            app.UseCors("AllowFrontend");

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseHttpsRedirection();   // nur lokal
            }

            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}