using System.Threading.Tasks;

namespace DNDGenSite.Repositories
{
    public interface ErrorRepository
    {
        Task Report(string title, string description);
    }
}
