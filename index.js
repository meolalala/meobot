const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fetch = require('node-fetch');

const insults = ['bitch', 'fuckhead', 'stupid idiot', 'why are you even talking', 'i hate u', 'be quiet stinky fox'];
const compliments = ['hi mushbun!!!', 'hows the bun today!!!', 'wao a qt!!!!', 'big hearts for smol bun', 'wowowowow urcute'];

client.once('ready', () => {
    client.user.setPresence({
        activity: { name: 'meola be dumb', type: 'WATCHING' }, status: 'idle'
    });
    console.log('Ready!');
});


// client.on('message', message => {
//     if (message.author.id === '111577705044066304' && message.channel.type === 'dm') {
//         message.channel.send(insults[Math.floor(Math.random() * insults.length)]);
//     } else if (message.author.id === '87116290535198720' && message.channel.type === 'dm') {
//         message.channel.send(compliments[Math.floor(Math.random() * compliments.length)]);
//     } else if (message.content === 'hi meobot') {
//         message.channel.send('hi!!!');
//     }
// });

client.on('message', message => {
    if (message.content === 'gimme porn') {
        const file = fetch('https://testbooru.donmai.us/posts/random').then(response => response.json())

        message.channel.send(file);
    }
});

client.login(config.token);