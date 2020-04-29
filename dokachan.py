import discord
from discord.ext import commands
from googletrans import Translator

class JapaneseHelpCommand(commands.DefaultHelpCommand):
    def __init__(self):
        super().__init__()
        self.commands_heading = 'コマンド:'
        self.no_category = 'その他'
        self.command_attrs['help'] = ""

    def get_ending_note(self):
        return (f"trans: 岡山の県北で培った語学力で翻訳するぜ。 /dokachan trans <翻訳先言語> <翻訳したい内容> で実行するんや\n"
                f"翻訳可能言語は、 /dokachan help-translist で確認してくれ。\n"
                f"help: 今開いている内容を出すぜ\n")


TOKEN = 'NzAzOTY1MzU2NTQ4Njg1ODg0.XqWY1Q.YmeP-sNuJh5PGBitDXyOfTHMiPg'
prefix = '/dokachan '


class Dokachan(commands.Cog):
    def __init__(self, bot):
        super().__init__()
        self.bot = bot

    def translate(self, lang, source):
        """translate

        Arguments:
            lang   {string} -- 翻訳先言語
            source {string} -- きたねぇ日本語を入れるぜ
        """
        trans_res = ''
        translator = Translator()
        trans_res = translator.translate(source, dest=lang).text

        return trans_res

    def translist(self):
        translist = ''
        trans_res = ("このサーバーでよく見かける言語に変換する場合はこれを使ってね。\n"
                    "英語  en\n"
                    "韓国語 ko\n"
                    "スペイン語 es\n"
                     "他の言語はこちらを参照してください https://cloud.google.com/translate/docs/languages?hl=ja")

        return trans_res


    @commands.command()
    async def trans(self, ctx, arg1, arg2):
        res = self.translate(arg1, arg2)
        await ctx.send(res)

    async def translist(self, ctx):
        res = self.translist()
        await ctx.send(res)

bot = commands.Bot(command_prefix=prefix,
                   help_command=JapaneseHelpCommand())
bot.add_cog(Dokachan(bot=bot))
bot.run(TOKEN)



