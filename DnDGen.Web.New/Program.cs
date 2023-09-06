using DnDGen.Web.New;

var builder = WebApplication.CreateBuilder(args);

Startup.ConfigureServices(builder.Services);

var app = builder.Build();

app.UseExceptionHandler("/Error");
app.UseHttpsRedirection();
app.MapControllers();

app.UseStaticFiles();
app.UseRouting();

app.Run();
