namespace DnDGen.Api.CreatureGen.Dependencies
{
    public interface IDependencyFactory
    {
        T Get<T>();
    }
}
