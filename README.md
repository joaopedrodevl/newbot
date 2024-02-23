# Bot de autenticação discord

Bot de autenticação do discord Engenharia de Computação - IFPB, campus Campina Grande.

**Feito em:** Typescript com a biblioteca discord.js

**ORM utilizado:** Prisma ORM

O envio do código via email é feito com o RESEND: https://resend.com/

## Autores

- [@jpedrodevl](https://www.github.com/jpedrdevl)
## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env.prod e .env.dev

`DISCORD_TOKEN`: Seu token do discord

`CLIENT_ID`: ID do seu cliente discord

`GUILD_ID`: ID do seu servidor do discord

`RESEND_TOKEN`: Crie seu token em: https://resend.com/

`STUDENT_ROLE_ID`: ID do cargo de estudante

`TEACHER_ROLE_ID`: ID do cargo de professor

`RESEND_FROM`: Nome do email que irá enviar o código. Exemplo: "email@dnscadastrado.com"

`CHAT_ID`: ID do chat principal

`STACKOVERFLOW_ID`: ID do chat para uso do stack overflow

`UPLOAD_CHANNEL_ID`: ID do chat para upload do arquivo .zip

`DATABASE_URL`: URL do banco de dados