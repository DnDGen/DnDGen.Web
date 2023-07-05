namespace DnDGen.Api.RollGen.Dependencies
{
    public interface IDependencyFactory
    {
        T Get<T>();
    }
}
