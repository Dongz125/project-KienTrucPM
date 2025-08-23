const {
    addSymbol,
    removeSymbol,
    replaceSymbol,
} = require("../services/userSessionService");
const { subscribe, unsubscribe } = require("../services/streamService");

function handleUserConnection(ws, userId) {
    ws.on("message", (msg) => {
        const { action, symbol, oldSymbol } = JSON.parse(msg);

        if (action === "subscribe") {
            try {
                addSymbol(userId, symbol);
                subscribe(symbol, ws);
                ws.send(JSON.stringify({ status: "subscribed", symbol }));
            } catch (err) {
                ws.send(JSON.stringify({ error: err.message }));
            }
        }

        if (action === "unsubscribe") {
            removeSymbol(userId, symbol);
            unsubscribe(symbol, ws);
            ws.send(JSON.stringify({ status: "unsubscribed", symbol }));
        }

        if (action === "replace") {
            try {
                replaceSymbol(userId, oldSymbol, symbol);
                unsubscribe(oldSymbol, ws);
                subscribe(symbol, ws);
                ws.send(
                    JSON.stringify({
                        status: "replaced",
                        oldSymbol,
                        newSymbol: symbol,
                    }),
                );
            } catch (err) {
                ws.send(JSON.stringify({ error: err.message }));
            }
        }
    });
}

module.exports = { handleUserConnection };
