"use strict";

const config = require("./settings.json");

// Secrets are read from the environment. Values left in settings.json are still
// honoured for backwards compatibility, but they end up in git history, so a
// warning is emitted when one is used.
function fromEnvOrConfig(envName, configValue, label) {
  const envValue = (process.env[envName] || "").trim();
  if (envValue) return envValue;

  const fileValue = (configValue || "").trim();
  if (fileValue && !fileValue.startsWith("YOUR_")) {
    console.log(
      `[Security] ${label} is stored in settings.json. Move it to the ${envName} environment variable - settings.json is committed to git.`,
    );
    return fileValue;
  }

  return "";
}

const autoAuthPassword = fromEnvOrConfig(
  "AUTO_AUTH_PASSWORD",
  config.utils &&
    config.utils["auto-auth"] &&
    config.utils["auto-auth"].password,
  "The auto-auth password",
);

const botAccountPassword = fromEnvOrConfig(
  "BOT_ACCOUNT_PASSWORD",
  config["bot-account"] && config["bot-account"].password,
  "The bot account password",
);

const discordWebhookUrl = fromEnvOrConfig(
  "DISCORD_WEBHOOK_URL",
  config.discord && config.discord.webhookUrl,
  "The Discord webhook URL",
);

const dashboardToken = (process.env.DASHBOARD_TOKEN || "").trim();

module.exports = {
  autoAuthPassword,
  botAccountPassword,
  discordWebhookUrl,
  dashboardToken,
};
