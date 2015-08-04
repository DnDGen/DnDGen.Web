using System;
using System.Threading.Tasks;

namespace DNDGenSite.Repositories
{
    public interface ErrorRepository
    {
        Task Report(String title, String description);
    }
}
