namespace DnDGen.Web.New.IoC
{
    public interface IDependencyFactory
    {
        T Get<T>();
    }
}
