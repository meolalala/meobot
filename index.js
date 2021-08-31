const Discord = require('discord.js');
const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const config = require('./config.json');

const Danbooru = require('danbooru');
const booru = new Danbooru;

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: 'false',
    storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.TEXT,
    username: Sequelize.STRING,
    usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
})

// import { compliments, insults } from './responses';

const booruRandomPosts = () => {
    booru.posts({ random: true, tags: '-loli -furry' }).then(posts => {
        const index = Math.floor(Math.random() * posts.length);
        const post = posts[index];
        const postEmbed = new Discord.MessageEmbed()
            .setColor('#B28E6A')
            .addFields(
                { name: 'artist via danbooru', value: post.tag_string_artist },
                { name: 'source via danbooru', value: post.source }
            )
            .setImage(post.large_file_url);
        client.channels.cache.get('776213030475399198').send(postEmbed);
    });
};


client.once('ready', () => {
    Tags.sync();
    client.user.setPresence({
        activity: { name: 'meola be dumb', type: 'WATCHING' }, status: 'idle'
    });
    console.log('Ready!');
    setInterval(booruRandomPosts, 600000);
});

// client.on('message', message => {
//     if (message.content === 'gimme porn') {
//         booru.posts({ random: true, tags: '-loli -furry' }).then(posts => {
//             const index = Math.floor(Math.random() * posts.length)
//             const post = posts[index]
//             const postEmbed = new Discord.MessageEmbed()
//                 .setColor('#B28E6A')
//                 .addFields(
//                     { name: 'artist via danbooru', value: post.tag_string_artist },
//                     { name: 'source via danbooru', value: post.source }
//                 )
//                 .setImage(post.large_file_url)
//             message.channel.send(postEmbed)
//         })
//     }
// })

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const tagName = interaction.options.getString('name');
    const { commandName: command } = interaction;

    if (command === 'addtag') {
        const tagDescription = interaction.options.getString('description');

        try {
            const tag = await Tags.create({
                name: tagName,
                description: tagDescription,
                username: interaction.user.username,
            });
            return interaction.reply('tag ${tag.name} added.');
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return interaction.reply('that tag already exists!!!!');
            }
            return interaction.reply('oh no.. something went wrong with adding that tag');
        }
    } else if (command === 'tag') {
        const tag = await Tags.findOne({ where: { name: tagName } });

        if (tag) {
            tag.increment('usage_count');
            return interaction.reply(tag.get('description'));
        }
        return interaction.reply('no tags exist for ${tagName} yet');
    } else if (command === 'edittag') {
        const tagDescription = interacion.options.getString('description');

        const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });

        if (affectedRows > 0) {
            return interaction.reply('the tag ${tagName} was edi.. edit.. edite.. BLEH');
        }
        return interaction.reply('wait theres a tag with that name..?');
    } else if (command === 'taginfo') {
        const tag = await Tags.findOne({ where: { name: tagName } });

        if (tag) {
            return interaction.reply('${tagName} was birthed by ${tag.username} at ${tag.createdAt} and has been abused ${tag.usage_count} times! wowie!');
        }
        return interaction.reply('there doesn\t seem to be something here with that name.. maybe ask mom?')
    } else if (command === 'showtags') {
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'theres no tags... oh no..';

        return interaction.reply('heres the tags!!! ${tagString}');
    } else if (command === 'removetag') {
        const rowCount = await Tags.destroy({ where: { name: tagName } });
        if (!rowCount) return interaction.reply('what does ${tagName} mean..');

        return interaction.reply('nerd_down');
    }
})

client.on('message', message => {
    if (message.author.id === '111577705044066304' && message.channel.type === 'dm') {
        message.channel.send(insults[Math.floor(Math.random() * insults.length)]);
    } else if (message.author.id === '87116290535198720' && message.channel.type === 'dm') {
        message.channel.send(compliments[Math.floor(Math.random() * compliments.length)]);
    } else if (message.content === 'hi meobot') {
        message.channel.send('hi!!!');
    }
});

client.login(config.token);