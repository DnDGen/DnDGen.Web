using Azure.Core.Serialization;
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.OpenTelemetry;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Diagnostics.CodeAnalysis;

namespace DnDGen.Api
{
    public static class StartupExtensions
    {
        public static void ConfigureDndgenServices(this IServiceCollection services)
        {
            var openTelemetry = services.AddOpenTelemetry()
                .UseFunctionsWorkerDefaults();

            ConfigureMonitoring(openTelemetry);

            services.Configure<WorkerOptions>(workerOptions =>
            {
                var settings = NewtonsoftJsonObjectSerializer.CreateJsonSerializerSettings();
                settings.ContractResolver = new CamelCasePropertyNamesContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy
                    {
                        ProcessDictionaryKeys = false,
                    }
                };
                settings.NullValueHandling = NullValueHandling.Ignore;

                workerOptions.Serializer = new NewtonsoftJsonObjectSerializer(settings);
            });
        }

        [ExcludeFromCodeCoverage(Justification = "Azure Monitor setup requires a live connection string")]
        private static void ConfigureMonitoring(IOpenTelemetryBuilder openTelemetry)
        {
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING")))
                openTelemetry.UseAzureMonitorExporter();
        }
    }
}
