
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const { Client, GatewayIntentBits,  ActivityType } = require('discord.js');
const { clientId, guildId, token } = {clientId:'1018152289367752735', guildId:'959561806425239593', token:"MTAxODE1MjI4OTM2Nzc1MjczNQ.GvZ7xK.mKk8tSpnVWGS6jTIfK4GmYuAHKzcFGHZl5cJ3U"}
const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder, Routes } = require('discord.js');
// Create a new client instance
const client = new Client({intents: [GatewayIntentBits.Guilds] });

function checkForUpdate(){
   const dates = JSON.parse(localStorage.getItem('dates')) || []
   console.log(dates)
   dates.forEach(date=>{
     const json = localStorage.getItem(date.title.toLocaleLowerCase()) || '{"hi":0}'
     console.log(json)
     const chapters = JSON.parse(json)
     const today = new Date().getDay() +1 

     if(date.date.includes(today.toString())){
      //console.log('the day')
      
      if(chapters){
      const lasCh = chapters[0]
      console.log(lasCh.time)
      console.log(new Date(lasCh.time).getDay())
      console.log(today)
      if(new Date(lasCh.time).getDay() ===today){
        console.log('released')
      }else{
         console.log('sent')
         
         client.channels.cache.get("927304401532624908").send(`لم ينزل الفصل ${parseInt(lasCh.ChapterNum) +1 } من عمل ${lasCh.title}`)
      }
    
     }else{
        console.log(chapters)
     }
    }else{
      console.log(today, date.date)
    }
   })
}

client.once('ready', () => {
	console.log('Ready2');
  const cat = ['filx', 'kylie', 'cychrides', 'scarpet', 'pazarion', 'naza', 'monarch']
  const choices = {}
  client.guilds.cache.get(guildId).channels.cache.forEach((channel, num)=>{
    const parentName = channel.parent?.name?.toLowerCase()
    if(cat.includes(parentName)){
    const pastChoices = choices[parentName] || [[]]
    if(pastChoices[pastChoices.length-1].length == 25){
      pastChoices.push([{name: channel.name, value:channel.id}])
      choices[parentName] = pastChoices
      return
    }
    pastChoices[pastChoices.length - 1].push({name: channel.name, value:channel.id})
    choices[parentName] =pastChoices
    return
    }
  })
//console.log(choices)
const options = {}
const commands0 = []
 for (const parent in choices) {
  if (Object.hasOwnProperty.call(choices, parent)) {
    const parentChoices = choices[parent];
    if(Array.isArray(parentChoices[0])){
      console.log(parentChoices, parent)
      parentChoices.forEach((list, num)=>{
        const command =  new SlashCommandBuilder()
        .setName(`send-${parent}${num? `-${num}` :''}`)
        .setDescription(`send raw to one of ${parent} series`)
        .addStringOption(option=>{
          //  console.log(list, list.length)
            return option.setName('series')
            .setDescription(`select one of ${parent} series`)
            .setChoices(...list)
            .setRequired(true)
         })
       // .addStringOption(option=>option.setName('series').setDescription('روم العمل ').setRequired(true))
        .addIntegerOption(option=>option.setName('chapter_number').setDescription(`th enumber of the raw chapter`).setRequired(true))
        .addAttachmentOption(option=> option.setName('src').setDescription('ملف مضغوط يحتوي صور الفصل'))
        .addStringOption(option=>option.setName('url').setDescription('رابط للفصل'))
        
      commands0.push(command)
      })
  }else{
    const command =  new SlashCommandBuilder()
     .setName(`send-${parent}`)
     .setDescription('send raw for a specific series')
     .addStringOption(option=>{
      return option.setName('series')
      .setDescription(`اختار احد اعمال ${parent}`)
      .setChoices(...parentChoices[0])
    })
      //.addStringOption(option=>option.setName('series').setDescription('روم العمل ').setRequired(true))
      .addIntegerOption(option=>option.setName('chapter_number').setDescription('the number of the chapter you want to send').setRequired(true))
      .addAttachmentOption(option=> option.setName('src').setDescription('ملف مضغوط يحتوي صور الفصل'))
      .addStringOption(option=>option.setName('url').setDescription('رابط للفصل'))
    
    commands0.push(command)
  }
 }
 }
const commands = [
	new SlashCommandBuilder().setName('send0').setDescription('send raw for a specific series'),
  ...commands0
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);


   //checkForUpdate()
});
var cron = require('node-cron');

cron.schedule("0 0 0 * * *", () => {
  checkForUpdate()
});
client.on('interactionCreate', async interaction => {
	//console.log(interaction)
     if (!interaction.isChatInputCommand());
     
     
     const { commandName } = interaction;
     if (commandName.startsWith('send-')) {
       if(!interaction.member.roles.cache.has('1022543741732528239')) {
         interaction.reply('انت لست موفر راو')
         return
       }
       const id = interaction.options.get('series').value
       const channel = interaction.guild.channels.cache.get(id)
       const src = interaction.options.getAttachment("src")
       const url = interaction.options.get('url')?.value 
       const num = interaction.options.get('chapter_number')?.value 
       if(!channel){
         interaction.reply("could'nt find the given series")
         return
       }
       const file = src?[{attachment: src?.attachment, name: src?.name}] :null;
       channel.send({content:`الفصل رقم ${num ? num:''} \n ${url?url:''}`, files:file})
       interaction.reply('تم ارسال الفصل بنجاح')
     }})
// Login to Discord with your client's token
client.login('MTAxODE1MjI4OTM2Nzc1MjczNQ.GvZ7xK.mKk8tSpnVWGS6jTIfK4GmYuAHKzcFGHZl5cJ3U').then(()=>{
  client.user.setPresence({
    activities: [{ name: `مبجل الطبلة السماوية مر من هنا`, type: ActivityType.Watching }],
    status: 'مبجل الطبلة السماوية مر من هنا',
  });
})
/*setInterval(()=>{
0 0 0 * * *
}, 1000*60*60*24)
*/
