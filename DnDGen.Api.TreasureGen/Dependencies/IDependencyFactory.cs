namespace DnDGen.Api.TreasureGen.Dependencies
{
    public interface IDependencyFactory
    {
        T Get<T>();
    }
}
