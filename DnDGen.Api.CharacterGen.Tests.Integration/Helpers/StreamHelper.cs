using Newtonsoft.Json;

namespace DnDGen.Api.CharacterGen.Tests.Integration.Helpers
{
    internal static class StreamHelper
    {
        public static string Read(Stream stream)
        {
            stream.Position = 0;
            using var reader = new StreamReader(stream);
            return reader.ReadToEnd();
        }

        public static T Read<T>(Stream stream)
        {
            var content = Read(stream);

            return JsonConvert.DeserializeObject<T>(content);
        }
    }
}
