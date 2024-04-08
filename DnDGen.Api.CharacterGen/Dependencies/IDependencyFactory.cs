namespace DnDGen.Api.CharacterGen.Dependencies
{
    public interface IDependencyFactory
    {
        T Get<T>();
    }
}
