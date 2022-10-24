const fs = require('fs');

module.exports = {
  name: 'help',
  description: 'List all available commands.',
  execute(interaction) {
    let str = '';
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    str = `\nName: !deploy, Description: This command executes and updates the commands list and bot status!\nName: !ping, Description: This command shows the status or latency of bot!\n`;

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      str += `Name: ${command.name}, Description: ${command.description} \n`;
    }

    return void interaction.reply({
      content: str,
      ephemeral: true,
    });
  },
};
