using DnDGen.Api.EncounterGen;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(Startup.ConfigureServices)
    .Build();

host.Run();
