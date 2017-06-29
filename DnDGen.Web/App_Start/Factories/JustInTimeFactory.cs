namespace DnDGen.Web.App_Start.Factories
{
    public interface JustInTimeFactory
    {
        T Create<T>();
        T Create<T>(string name);
    }
}
