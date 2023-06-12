using DnDGen.Web;

var builder = WebApplication.CreateBuilder(args);

Startup.ConfigureServices(builder.Services);

var app = builder.Build();

app.UseExceptionHandler("/Error");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}");
app.MapControllerRoute(name: "randomizers", pattern: "Characters/{controller=Randomizers}/{action=Verify}");
app.MapControllerRoute(name: "leadership", pattern: "Characters/{controller=Leadership}/{action=Generate}");

app.Run();
