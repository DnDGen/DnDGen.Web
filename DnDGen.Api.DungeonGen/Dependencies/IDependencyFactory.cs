namespace DnDGen.Api.DungeonGen.Dependencies
{
    public interface IDependencyFactory
    {
        T Get<T>();
    }
}
