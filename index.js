const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

const Danbooru = require('danbooru');
const booru = new Danbooru;

const insults = [
    'bitch',
    'fuckhead',
    'stupid idiot',
    'why are you even talking',
    'i hate u',
    'be quiet stinky fox',
    'lol who lets a fox inside',
    'what kind of idiot are you',
    'if there were two people left on earth and it was me and you I still wouldn\'t be nice',
    'when you look at mirrors they crack',
    'shut the fuck up',
    'go eat some meat stinky'
];

const compliments = [
    'hi mushbun!!!',
    'hows the bun today!!!',
    'wao a qt!!!!',
    'big hearts for smol bun',
    'wowowowow urcute',
    'here you can have some tails to rest on',
    'make sure you\'re drinking water!!',
    'make sure to eat!!',
    'don\'t stay up too late!!',
    'remember I\'ll always love you~'
];

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