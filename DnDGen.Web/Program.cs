var allowCors = "_allowCors";
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddCors(options =>
    {
        options.AddPolicy(name: allowCors,
            policy =>
            {
                policy.WithOrigins("*");
            });
    }).AddControllersWithViews()
    .AddNewtonsoftJson();

var app = builder.Build();

app.UseExceptionHandler("/Error");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors(allowCors);

app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}");

app.Run();
