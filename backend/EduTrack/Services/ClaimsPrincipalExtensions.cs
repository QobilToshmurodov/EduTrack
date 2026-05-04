using System.Security.Claims;

namespace EduTrack.Services
{
    public static class ClaimsPrincipalExtensions
    {
        public static int? GetUserId(this ClaimsPrincipal user)
        {
            var value = user.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(value, out var id) ? id : null;
        }

        public static int? GetProfileId(this ClaimsPrincipal user)
        {
            var value = user.FindFirstValue(JWTService.ProfileIdClaim);
            return int.TryParse(value, out var id) ? id : null;
        }

        public static string? GetRole(this ClaimsPrincipal user)
            => user.FindFirstValue(ClaimTypes.Role);
    }
}
