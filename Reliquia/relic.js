import { system, world, ItemStack } from "@minecraft/server";

// Este codigo fue creado por Convex, tw: https://twitter.com/convex__ ; discord: @convecs#6207 y esta bajo la licencia MIT, esta permitido su uso comercial o privado siempre que se incluyan los creditos del creador.
// Funciona para la creacion de una reliquia que libera slots del inventario bloqueados, debajo estan las especificaciones de cada variable, modifica a las necesidades de tu relquia, cualquier duda contacta con Convex.

const relic = "minecraft:apple";    //Identificador del item que funcionara como tu reliquia.
const lock = "minecraft:barrier";   //Identificador del item que funcionara como bloqueo de slot.
const lockedSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];    //Lista o Arreglo de slots que se perderan, no tienen que ser numeros seguidos, pueden ser 2, 5, 8, van del 0 hasta el 35 y siguen el orden del inventario.
const delay = 20;   //Retraso en ticks entre cada ejecucion del efecto de la reliquia, defalult 20 ticks = 1 segundo.
const setOffHand = true;    //True para bloquear tambien la offHand, false para no hacerlo.
const offHandItems = [  //En caso de bloquear la offHand aqui debe de estar la lista de los items que podria tener el jugador, para no ser perdidos.
    {
        itemOffHand: "totem",   //Nombre in-game.
        itemTypeId: "minecraft:totem_of_undying"    //Identificador para el constructor (Si es un item custom el nombre y el identificador seran iguales).
    },
    {
        itemOffHand: "shield",
        itemTypeId: "minecraft:shield"
    }
];

//Debajo esta el codigo para que funcione la reliquia, no se recomenda que se modifique a menos que se sepa lo que se esta haciendo, se recomienda solo modificar los valores de arriba.

system.runInterval((loops) => {
    for (const player of world.getPlayers()) {
        let inventory = player.getComponent("inventory").container;
        let dim = player.dimension;
        let itemLock = new ItemStack(lock);
        itemLock.lockMode = 'slot';
        let pblock = world.getDimension("overworld").getBlock({ x: player.location.x, y: player.location.y, z: player.location.z });
        const itemLockData = { "item_lock": { "mode": "lock_in_slot" } };
        if (searchInventory(relic, player)) {
            player.runCommandAsync(`clear @s ${lock.replace(/"/g, '')}`);
        } else {
            for (let i = 0; i < inventory.size; i++) {
                if (lockedSlots.includes(i)) {
                    let item = inventory.getItem(i);
                    if (item != undefined && item.typeId != lock) {
                        dim.spawnItem(item, pblock);
                        inventory.setItem(i, itemLock);
                    } else if (item == undefined) {
                        inventory.setItem(i, itemLock);
                    }
                }
            }
            if (setOffHand) {
                for (const offHandItem of offHandItems) {
                    checkOffHand(player, offHandItem.itemOffHand, itemLockData, pblock, dim, offHandItem.itemTypeId);
                }
            }
        }
    }
}, delay);

function searchInventory(itemSearch, player) {
    let inventory = player.getComponent("inventory").container;
    for (let i = 0; i < inventory.size; i++) {
        let item = inventory.getItem(i);
        if (item == undefined) continue;
        if (item.typeId == itemSearch) {
            return true;
        }
    } return false;
}

async function checkOffHand(player, itemOffHand, itemLockData, pblock, dim, itemTypeId) {
    const hasItem = await checkCommand(`execute as ${player.name} run testfor @s[hasitem={item=${itemOffHand},location=slot.weapon.offhand}]`);
    if (hasItem) {
        player.runCommandAsync(`replaceitem entity @s slot.weapon.offhand 0 ${lock.replace(/"/g, '')} 1 0 ${JSON.stringify(itemLockData)}`);
        const itemStack = new ItemStack(itemTypeId);
        dim.spawnItem(itemStack, pblock);
    } else {
        player.runCommandAsync(`replaceitem entity @s slot.weapon.offhand 0 ${lock.replace(/"/g, '')} 1 0 ${JSON.stringify(itemLockData)}`);
    }
}

function checkCommand(args) {
    return new Promise((resolve) => {
        world.getDimension("overworld").runCommandAsync(args).then((result) => {
            resolve(result);
        }).catch((error) => {
            resolve(false);
        });
    });
}
