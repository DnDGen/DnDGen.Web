using System;

namespace DnDGen.Web.App_Start.Factories
{
    public interface RuntimeFactory
    {
        T Create<T>();
        T Create<T>(String name);
    }
}
