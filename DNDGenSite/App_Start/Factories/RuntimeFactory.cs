using System;

namespace DNDGenSite.App_Start.Factories
{
    public interface RuntimeFactory
    {
        T Create<T>();
        T Create<T>(String name);
    }
}
