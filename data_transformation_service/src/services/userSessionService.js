const sessions = new Map(); // userId -> [symbols]

function addSymbol(userId, symbol) {
    if (!sessions.has(userId)) {
        sessions.set(userId, []);
    }
    const userSymbols = sessions.get(userId);

    if (userSymbols.length >= 4) {
        throw new Error("Bạn chỉ được xem tối đa 4 cặp tiền cùng lúc");
    }
    if (!userSymbols.includes(symbol)) {
        userSymbols.push(symbol);
    }
}

function removeSymbol(userId, symbol) {
    if (!sessions.has(userId)) return;
    sessions.set(
        userId,
        sessions.get(userId).filter((s) => s !== symbol),
    );
}

function getUserSymbols(userId) {
    return sessions.get(userId) || [];
}

function replaceSymbol(userId, oldSymbol, newSymbol) {
    if (!sessions.has(userId)) {
        sessions.set(userId, []);
    }
    let userSymbols = sessions.get(userId);

    if (!userSymbols.includes(oldSymbol)) {
        throw new Error(`Bạn chưa đăng ký cặp ${oldSymbol}`);
    }

    if (userSymbols.includes(newSymbol)) {
        throw new Error(`Bạn đã đăng ký cặp ${newSymbol} rồi`);
    }

    // Thay thế
    userSymbols = userSymbols.map((s) => (s === oldSymbol ? newSymbol : s));
    sessions.set(userId, userSymbols);
}

module.exports = { addSymbol, removeSymbol, getUserSymbols, replaceSymbol };
