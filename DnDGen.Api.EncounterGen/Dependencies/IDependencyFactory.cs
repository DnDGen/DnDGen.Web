namespace DnDGen.Api.EncounterGen.Dependencies
{
    public interface IDependencyFactory
    {
        T Get<T>();
    }
}
