using DnDGen.Web;

var builder = WebApplication.CreateBuilder(args);

var startup = new Startup(builder.Environment);
startup.ConfigureServices(builder.Services);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();
startup.Configure(app, app.Environment);

app.MapControllerRoute(name: "Default", pattern: "{controller=Home}/{action=Index}");
app.MapControllerRoute(name: "Randomizers", pattern: "Characters/{controller=Randomizers}/{action=Verify}");
app.MapControllerRoute(name: "Leadership", pattern: "Characters/{controller=Leadership}/{action=Generate}");

app.MapRazorPages();

app.Run();
