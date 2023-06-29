namespace DnDGen.Web.App_Start
{
    public interface IDependencyFactory
    {
        T Get<T>();
    }
}
