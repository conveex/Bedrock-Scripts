import { world } from "@minecraft/server";

// Este codigo fue creado por Convex, tw: https://twitter.com/convex__ ; discord: @convecs#6207 y esta bajo la licencia MIT, esta permitido su uso comercial o privado siempre que se incluyan los creditos del creador.
// Funciona para enviar un mensaje de con coordenadas y dimension del lugar de muerte de algun jugador, debajo estan las especificaciones de cada variable, modifica a las necesidades de tu mensaje de muerte, cualquier duda contacta con Convex.

const deathMsg = "Ha muerto en:"; //Puedes modificar este valor para personalizar como sale el mensaje de muerte.
const dimMsg = "Dimension:"; //Puedes modificar este valor para personalizar como sale el mensaje de muerte.
const msgColor = "§7"; //Puedes modificar este valor para personalizar como sale el color del mensaje de muerte.
const dimensionNames = ["§aOverworld§r", "§cNether§r", "§dThe End§r", "§7Unknown dimension§r"]; //Puedes modificar estos valores para personalizar como saldra el nombre de cada dimension al morir.

world.events.entityDie.subscribe(data => {
    const entity = data.deadEntity;
    if (entity.typeId != 'minecraft:player') return;
    sendDeathMessage(entity);
});

function sendDeathMessage(player) {
    let dimensionName;
    switch (player.dimension.id) {
        case "minecraft:overworld":
            dimensionName = dimensionNames[0];
            break;
        case "minecraft:nether":
            dimensionName = dimensionNames[1];
            break;
        case "minecraft:the_end":
            dimensionName = dimensionNames[2];
            break;
        default:
            dimensionName = dimensionNames[3];
            break;
    }
    player.sendMessage(`${msgColor}${player.name} ${deathMsg} x: ${Math.floor(player.location.x)} y: ${Math.floor(player.location.y)} z: ${Math.floor(player.location.z)}. ${dimMsg} ${dimensionName}`);
}
