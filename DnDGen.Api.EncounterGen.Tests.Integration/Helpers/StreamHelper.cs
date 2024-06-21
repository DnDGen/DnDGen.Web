namespace DnDGen.Api.EncounterGen.Tests.Integration.Helpers
{
    internal static class StreamHelper
    {
        public static string Read(Stream stream)
        {
            using var reader = new StreamReader(stream);
            return reader.ReadToEnd();
        }
    }
}
