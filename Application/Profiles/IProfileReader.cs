using System.Threading.Tasks;
using Application.Profiles;

namespace Application.Profiles
{
    public interface IProfileReader
    {
        Task<Profile> ReadProfile(string username);
    }
}