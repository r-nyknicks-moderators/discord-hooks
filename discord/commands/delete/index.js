const { Command } = require("nodejsdiscordbot");

module.exports = class DeletePost extends Command {
    constructor() {
        super(
            "delete",
            ["id"],
            []
            );
    }

    async _run(ctx, args) {
        return ctx.channel.send("Deleting post...");
    }
}