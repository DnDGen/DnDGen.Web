using Microsoft.Azure.Functions.Worker.Http;

namespace DnDGen.Api
{
    public static class SerializationExtensions
    {
        public static ValueTask WriteDnDGenModelAsJsonAsync<T>(this HttpResponseData response, T instance, CancellationToken cancellationToken = default)
        {
            return response.WriteAsJsonAsync<object?>(instance, cancellationToken);
        }
    }
}
