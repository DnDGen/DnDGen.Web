﻿using Microsoft.Extensions.Logging;
using Moq;

namespace DnDGen.Api.CharacterGen.Tests.Unit
{
    public static class LoggerAssertionExtensions
    {
        public static void AssertLog(this Mock<ILogger> mockLogger, string message, LogLevel logLevel = LogLevel.Information)
        {
            mockLogger.Verify(
                x => x.Log(
                    It.Is<LogLevel>(l => l == logLevel),
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString() == message),
                    It.IsAny<Exception>(),
                    It.Is<Func<It.IsAnyType, Exception, string>>((v, t) => true)),
                Times.Once, $"Expected message: '{message}'");
        }
    }
}
