<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test
```

## Acceso a la Documentación de la API

Se habilitó una documentación de Swagger que se puede acceder en:

http://localhost:3000/api

## Consideraciones sobre el Uso de Variables de Entorno

Para entornos de producción, se recomienda almacenar los archivos .env en un Secret Manager o HashiCorp Vault, ya que no es buena práctica publicar archivos .env en repositorios públicos. Sin embargo, dado que este es un desafío técnico, se ha decidido hacerlo en este caso.

## Autenticación

Aunque no se solicitó autenticación explícita, se implementó un Guard para todos los controladores. Este Guard utiliza un JWT mínimo que incluye los datos del usuario. A continuación, se adjunta el Bearer sin expiración para cada uno de los usuarios.

```
usuario 1
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudG51bWJlciI6IjEwMDAxIiwiZW1haWwiOiJlbWlsaWFub0B0ZXN0LmNvbSJ9.6bmf6UuUd0dlKOdsW6RnGU8L0mC77bERtOFNDb592DQ

usuario 2
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiYWNjb3VudG51bWJlciI6IjEwMDAyIiwiZW1haWwiOiJqb3NlQHRlc3QuY29tIn0.CEVb6YSexudAnOEqIGFzfaAelcikwQH3tyHxIraiJao

usuario 3
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiYWNjb3VudG51bWJlciI6IjEwMDAzIiwiZW1haWwiOiJmcmFuY2lzY29AdGVzdC5jb20ifQ.HS0IbycvHcatyQ9PPaHtjcd_CM_nnQvM75iHd3cI0-A

usuario 4
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiYWNjb3VudG51bWJlciI6IjEwMDA0IiwiZW1haWwiOiJqdWFuQHRlc3QuY29tIn0.1Ok8rUZc_FMWphr0t5jximtt3HgDekeuzm-FYTbltMc
```

# cocos-challenge-backend

**Resumen:**
Desarrollar una API que permita obtener la siguiente información a traves de endpoints:
- **Portfolio**: La respuesta deberá devolver el valor total de la cuenta de un usuario, sus pesos disponibles para operar y el listado de activos que posee (incluyendo cantidad de acciones, el valor total monetario de la posición ($) y el rendimiento total (%)).
- **Buscar activos**: La respuesta deberá devolver el listado de activos similares a la busqueda realizada (tiene que soportar busqueda por ticker y/o por nombre).
- **Enviar una orden al mercado**: A traves de este endpoint se podrá enviar una orden de compra o venta del activo. Soportando dos tipos de ordenes: MARKET y LIMIT. Las ordenes MARKET no requieren que se envíe el precio ya que se ejecutara la orden con las ofertas del mercado, por el contrario, las ordenes limite requieren el envío del precio al cual el usuario quiere ejecutar la orden. La orden quedará grabada en la tabla `orders` con el estado y valores correspondientes.

**Opcionales / Nice to haves:**
- Proveer una coleccion de Postman, Insomnia o REST Client para la API y ejemplos de como invocarla.

# Consideraciones funcionales
- Los precios de los activos tienen que estar en pesos.
- NO hace falta simular el mercado.
- Cuando un usuario envía una orden, es necesario enviar la cantidad de acciones que quiere comprar o vender. Permitir al usuario enviar la cantidad de acciones exactas o un monto total de inversión en pesos (en este caso, calcular la cantidad de acciones máximas que puede enviar, no se admiten fracciones de acciones).
- Las ordenes tienen un atributo llamado `side` que describe si la orden es de compra (`BUY`) o venta (`SELL`).
- Las ordenes tienen distintos estados (status): 
    - `NEW` - cuando una orden limite es enviada al mercado, se envía con este estado.
    - `FILLED` - cuando una orden se ejecuta. Las ordenes market son ejecutadas inmediatamente al ser enviadas.
    - `REJECTED` - cuando la orden es rechazada por el mercado ya que no cumple con los requerimientos, como por ejemplo cuando se envía una orden por un monto mayor al disponible.
    - `CANCELLED` - cuando la orden es cancelada por el usuario.
- Cuando un usuario manda una orden de tipo MARKET, la orden se ejecuta inmediatamente y el estado es `FILLED`.
- Cuando un usuario manda una order de tipo LIMIT, la orden el estado de la orden tiene que ser `NEW`.
- Solo se pueden cancelar las ordenes con estado `NEW`.
- Si la orden enviada es por un monto mayor al disponible, la orden tiene que ser rechazada y guardarse en estado REJECTED. Tener en cuenta tanto el caso de compra validar que el usuario tiene los pesos suficientes y en el de venta validar que el usuario tiene las acciones suficientes.
- Las transferencias entrantes y salientes se pueden modelar como ordenes. Las transferencias entrantes tiene side `CASH_IN` mientras que las salientes side `CASH_OUT`.
- Cuando una orden es ejecutada, se tiene que actualizar el listado de posiciones del usuario.
- Para hacer el calculo de la tenencia y pesos disponibles utilizar todos los movimientos pertinentes que hay en la tabla `orders`, utilizando la columna `size`.
- El cash (ARS) esta modelado como un instrumento de tipo 'MONEDA'.
- En la tabla `marketdata` se encuentras los precios de los ultimos 2 dias de los instrumentos. El `close`, es el último precio de cada activo. Para calcular el retorno diario utilizar las columnas `close` y `previousClose`.
- Cuando se envia una orden de tipo `MARKET`, utilizar el último precio (`close`).
- Para calcular el valor de mercado, rendimiento y cantidad de acciones de cada posición usar las ordenes en estado `FILLED` de cada activo.

# Consideraciones técnicas
- **Para la API REST Express.js y TypeORM**
- Desarrollar la aplicación utilizando Node.js. 
  - Para la API REST utilizar algún framework a elección como Express o NestJS.
  - Elegir alguna estrategia o libreria para el acceso a datos. Es posible utilizar un ORM o ejecutar consultas directamente.
  - Utilizar cualquier libreria o framework que se crea conveniente.
- Implementar un test funcional sobre la función para enviar una orden.
- NO es necesario implementar autenticación de usuarios.
- Documentá cualquier suposición o decisión de diseño que consideres relevante.

# Base de datos
Ya hemos creado una base de datos con las siguientes tablas y algunos datos (pueden usar el archivo `database.sql` para crear y popular las tablas):
- **users**: id, email, accountNumber
- **instruments**: id, ticker, name, type
- **orders**: id, instrumentId, userId, side, size, price, type, status, datetime
- **marketdata**: id, instrumentId, high, low, open, close, previousClose, datetime


- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
