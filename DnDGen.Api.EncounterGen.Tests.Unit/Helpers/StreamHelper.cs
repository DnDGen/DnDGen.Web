namespace DnDGen.Api.EncounterGen.Tests.Unit.Helpers
{
    internal static class StreamHelper
    {
        public static string Read(Stream stream)
        {
            stream.Position = 0;
            using var reader = new StreamReader(stream);
            return reader.ReadToEnd();
        }
    }
}
