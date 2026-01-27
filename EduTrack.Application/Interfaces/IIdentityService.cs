namespace EduTrack.Application.Interfaces
{
    public interface IIdentityService
    {
        Task<(bool Succeeded, string? Token)> LoginAsync(string username, string password);
    }
}
