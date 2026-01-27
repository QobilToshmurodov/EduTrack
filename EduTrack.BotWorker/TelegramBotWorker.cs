using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace EduTrack.BotWorker
{
    public class TelegramBotWorker : BackgroundService
    {
        private readonly ILogger<TelegramBotWorker> _logger;
        private readonly IConfiguration _configuration;
        private ITelegramBotClient _botClient;

        public TelegramBotWorker(ILogger<TelegramBotWorker> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            
            var token = _configuration["TelegramBot:Token"];
            if (!string.IsNullOrEmpty(token) && token != "YOUR_BOT_TOKEN_HERE")
            {
                _botClient = new TelegramBotClient(token);
            }
            else
            {
                _logger.LogWarning("Telegram Bot token topilmadi yoki xato. Bot xizmati ishlamaydi.");
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (_botClient == null)
            {
                _logger.LogError("Telegram BotClient yaratilmagan. Worker to'xtatildi.");
                return;
            }

            _logger.LogInformation("Telegram Bot Worker starting...");

            _botClient.StartReceiving(
                updateHandler: (bot, update, ct) => HandleUpdateAsync(bot, update, ct),
                errorHandler: (bot, ex, ct) => HandlePollingErrorAsync(bot, ex, ct),
                cancellationToken: stoppingToken
            );

            await Task.Delay(Timeout.Infinite, stoppingToken);
        }

        private async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
        {
            if (update.Message is not { Text: { } messageText } message)
                return;

            var chatId = message.Chat.Id;
            _logger.LogInformation($"Received a '{messageText}' message in chat {chatId}.");

            if (messageText.StartsWith("/start"))
            {
                await botClient.SendMessage(
                    chatId: chatId,
                    text: "Assalomu alaykum! EduTrack tizimiga xush kelibsiz. \nOta-ona sifatida bog'lanish uchun kodingizni kiriting.",
                    cancellationToken: cancellationToken);
            }
        }

        private Task HandlePollingErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "Telegram Bot API Error");
            return Task.CompletedTask;
        }
    }
}
