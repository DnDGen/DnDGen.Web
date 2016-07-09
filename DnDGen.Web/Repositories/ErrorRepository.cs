using System.Threading.Tasks;

namespace DnDGen.Web.Repositories
{
    public interface ErrorRepository
    {
        Task Report(string title, string description);
    }
}
