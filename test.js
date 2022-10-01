const { Client, GatewayIntentBits } = require('discord.js');
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = {clientId:'930486659470991370', guildId:'927304400412766278', token:"OTMwNDg2NjU5NDcwOTkxMzcw.Yd2lOw.PEVH4LJlwcB_JjyRgTr-OeDJC44"}
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle , SelectMenuBuilder } = require('discord.js');
const client = new Client({
	intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
///DateStorage = new LocalStorage('./dates');
const discordModals = require('discord-modals'); 
const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
discordModals(client);



client.once('ready', async () => {
	console.log('ready');
    client.guilds.cache.get('888405450616352809').channels.cache.get('888413319940145162').messages.fetch({ limit: 24}).then(msgs=>{
		msgs.forEach(msg => {
			client.emit('messageCreate', msg)
		});
	})
});


const commands = [
	new SlashCommandBuilder().setName('addseries').setDescription('add a seires for the bot to listen to'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

 client.on('interactionCreate', async interaction => {
	//console.log(interaction)
     if (!interaction.isChatInputCommand());
     
     
     const { commandName } = interaction;
     if (commandName === 'addseries') {
	
        /*const menu = new SelectMenuBuilder()
		 .setCustomId('selectseriesdate')
		 .setPlaceholder('اختر مواعيد نزول الفصول')
		 .addOptions(
			 {
				 label: 'Sunday-الاحد',
				 value: '1',
				 description:'hi'
			 },
			 {
				 label: 'Monday-الاثنين',
				 value:'2',
				 description:'hi'

			 },
			 {
				label: 'Tuesday-الثلاثاء',
				value:'3',
				description:'hi'
				
			},
			{
				label: 'Wednesday-الأربعاء',
				value:'4',
				description:'hi'
				
			},
			{
				label: 'thursday-الخميس',
				value:'5',
				description:'hi'
				
			},
			{
				label: 'Friday-الجمعة',
				value:'6',
				description:'hi'
				
			},
			{
				label: 'saturday-السبت',
				value:'7',
				description:'hi'
				
			},
		 ) */
		 
		 const modal = new Modal() // We create a Modal
		 .setCustomId('AddSeriesModal')
		 .setTitle('Modal')
		 .addComponents(
			 new TextInputComponent() // We create a Text Input Component
				 .setCustomId('addSeriesModalInputTitle')
				 .setLabel('Series Title')
				 .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
				 .setPlaceholder('اكتب اسم العمل')
				 .setRequired(true), // If it's required or not
		 );
		 showModal(modal, {
			client: client, // Client to show the Modal through the Discord API.
			interaction: interaction, // Show the modal with interaction data.
		});

     } else if (commandName === 'server') {
         await interaction.reply('Server info.');
     } else if (commandName === 'user') {
         await interaction.reply('User info.');
     }
 });
     
 client.on('interactionCreate', async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'AddSeriesModal') {
        const title = interaction.fields.getTextInputValue('addSeriesModalInputTitle');
		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId(`SeriesDateSelect-${title}`)
					.setPlaceholder('اختار مواعيد نزول العمل')
					.setMaxValues(7)
					.addOptions(
						{
							label: 'Sunday-الاحد',
							value: '1',
						},
						{
							label: 'Monday-الاثنين',
							value:'2',
		   
						},
						{
						   label: 'Tuesday-الثلاثاء',
						   value:'3'
						   
					   },
					   {
						   label: 'Wednesday-الأربعاء',
						   value:'4',
						   
					   },
					    {
						   label: 'thursday-الخميس',
						   value:'5',
						   
					   },
					   {
						   label: 'Friday-الجمعة',
						   value:'6'
						   
					   },
					   {
						   label: 'saturday-السبت',
						   value:'7',
						   
					   },
					),
			);

		await interaction.reply({ components: [row] });
	}
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu()) return;

	if (interaction.customId.startsWith("SeriesDateSelect-")) {
		const title = interaction.customId.split('SeriesDateSelect-').pop()
	    const dates = JSON.parse(localStorage.getItem('dates')) || []
		localStorage.setItem('dates', JSON.stringify([...dates, {date: interaction.values, title:title}]))
		await interaction.update({ content: `تم اضافة العمل ${title} `, components: []});
	}
});
client.on('messageCreate', msg=>{
 if(msg.channelId === '888413319940145162'){
	if(msg.embeds[0]){
      const URL = msg.embeds[0].fields.pop().value.split('(')[1].replace(')', '')
	  const ChapterNum = msg.embeds[0].fields.pop().name.split('رقم الفصل')[1]
	  const title = msg.embeds[0].title.split('فصل جديد من العظمة ')[1]
	  const time = new Date( msg.embeds[0].timestamp)
	  /*console.log(URL)
	  console.log(ChapterNum)
	  console.log(time)*/
	  const data = {
		URL,
		ChapterNum,
		title,
		time
	  }
	  const perv = JSON.parse(localStorage.getItem(title.toLowerCase())) || []
	  let current = [...new Set([...perv, data ])];
	  //console.log(current)
	  localStorage.setItem(title.toLocaleLowerCase(), JSON.stringify(current, null, 4))
	}
 }
})

require('.')
client.login('OTMwNDg2NjU5NDcwOTkxMzcw.Yd2lOw.PEVH4LJlwcB_JjyRgTr-OeDJC44');