namespace EduTrack.Services
{
    public static class FileValidator
    {
        public static readonly HashSet<string> DocumentExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
            ".txt", ".zip", ".rar", ".png", ".jpg", ".jpeg"
        };

        public static readonly HashSet<string> ImageExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".jfif"
        };

        public const long MaxDocumentSize = 10 * 1024 * 1024;
        public const long MaxImageSize = 5 * 1024 * 1024;

        public static string? Validate(IFormFile file, HashSet<string> allowedExtensions, long maxSize)
        {
            if (file is null || file.Length == 0)
                return "Empty file";
            if (file.Length > maxSize)
                return $"File exceeds {maxSize / (1024 * 1024)}MB";

            var ext = Path.GetExtension(file.FileName);
            if (string.IsNullOrEmpty(ext) || !allowedExtensions.Contains(ext))
                return "File type not allowed";

            return null;
        }
    }
}
