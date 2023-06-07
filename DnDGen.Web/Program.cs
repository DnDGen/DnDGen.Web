using DnDGen.Web.Repositories;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler(exceptionHandlerApp =>
    {
        exceptionHandlerApp.Run(async context =>
        {
            var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
            if (exceptionHandlerPathFeature?.Error == null)
            {
                return;
            }

            var exception = exceptionHandlerPathFeature.Error;

            var errorRepository = context.RequestServices.GetService<ErrorRepository>();
            errorRepository.Report(exception.Message, exception.StackTrace);

            context.Response.Redirect("~/Error");

        });
    });

    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.MapControllerRoute(name: "Default", pattern: "{controller=Home}/{action=Index}");
app.MapControllerRoute(name: "Randomizers", pattern: "Characters/{controller=Randomizers}/{action=Verify}");
app.MapControllerRoute(name: "Leadership", pattern: "Characters/{controller=Leadership}/{action=Generate}");

app.MapRazorPages();

app.Run();
