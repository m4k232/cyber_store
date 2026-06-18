export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, contact, country, address, cart, total } = req.body;

    if (!name || !contact || !cart || cart.length === 0) {
        return res.status(400).json({ message: 'Invalid order data' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.error("Missing Telegram configuration");
        return res.status(500).json({ message: 'Server configuration error' });
    }

    // Format the message
    let text = `🛒 *New Order from CyberSneaks*\n\n`;
    text += `👤 *Customer:* ${name}\n`;
    text += `📞 *Contact:* ${contact}\n`;
    if (country) text += `🌐 *Country:* ${country}\n`;
    if (address) text += `📍 *Address:* ${address}\n`;
    text += `\n🛍 *Items:*\n`;
    
    cart.forEach(item => {
        text += `- ${item.name} (x${item.quantity}) - $${item.price * item.quantity}\n`;
    });
    
    text += `\n💰 *Total:* $${total}`;

    try {
        const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Telegram API error: ${errorBody}`);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        return res.status(500).json({ success: false, error: 'Failed to process order' });
    }
}