# Telegram Bot Setup Guide 🤖

## Step 1: Create a Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start a chat** with BotFather and send `/newbot`
3. **Choose a name** for your bot (e.g., "Triple-Z Orders Bot")
4. **Choose a username** for your bot (must end with "bot", e.g., "triplez_orders_bot")
5. **Copy the Bot Token** that BotFather gives you

## Step 2: Get Your Chat ID

### Option A: Use Your Personal Chat
1. **Start a chat** with your new bot
2. **Send a message** to your bot (e.g., "Hello")
3. **Open this URL** in your browser (replace YOUR_BOT_TOKEN):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. **Find your chat ID** in the JSON response under `message.chat.id`

### Option B: Create a Group (Recommended for business)
1. **Create a new group** in Telegram
2. **Add your bot** to the group
3. **Make the bot an admin** (optional but recommended)
4. **Send a message** in the group
5. **Use the same URL** as above to get the group chat ID
6. **Group IDs** usually start with a minus sign (e.g., `-1001234567890`)

## Step 3: Update Your .env File

Update your `server/.env` file with your bot credentials:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
TELEGRAM_CHAT_ID=123456789
```

Or for a group:
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
TELEGRAM_CHAT_ID=-1001234567890
```

## Step 4: Test Your Bot

1. **Restart your server** after updating the .env file
2. **Place a test order** on your website
3. **Check your Telegram** - you should receive a detailed order notification!

## What You'll Receive 📱

When a new order is placed, you'll get a message with:
- 📋 Order number and status
- 👤 Customer information (name, email, phone)
- 🛒 Product details with prices
- 💳 Payment method and details
- 🚚 Shipping address
- 💰 Order summary with total
- 📝 Customer notes (if any)

## Security Tips 🔒

- **Keep your bot token secure** - never share it publicly
- **Use a dedicated group** for order notifications
- **Make the group private** and only invite trusted team members
- **Consider using a separate bot** for different stores/environments

## Troubleshooting 🛠️

If you don't receive messages:
1. **Check your .env file** - make sure bot token and chat ID are correct
2. **Restart your server** after changing .env
3. **Check server logs** for any Telegram errors
4. **Verify the bot is active** by sending it a message directly
5. **For groups**: Make sure the bot is added and has permission to send messages

## Advanced Features 🚀

The bot automatically:
- ✅ Formats messages beautifully with emojis
- ✅ Extracts alternative phone numbers from order notes
- ✅ Handles different payment methods
- ✅ Shows order totals and discounts
- ✅ Uses Cairo timezone for order dates
- ✅ Won't crash your server if Telegram is down

Enjoy your automated order notifications! 🎉