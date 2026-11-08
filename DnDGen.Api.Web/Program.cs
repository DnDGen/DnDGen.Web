using DnDGen.Api.Web;
using Microsoft.Extensions.Hosting;
using System.Diagnostics.CodeAnalysis;

var host = Startup.GetHost();

host.Run();

[ExcludeFromCodeCoverage(Justification = "Entry point")]
partial class Program { }