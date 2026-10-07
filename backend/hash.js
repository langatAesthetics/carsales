const bcrypt = require("bcryptjs");

(async () => {
    const hash = await bcrypt.hash("Admin@12345", 10);
    console.log(hash);
})();