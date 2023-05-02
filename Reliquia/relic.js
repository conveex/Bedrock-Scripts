import { system, world, ItemStack } from "@minecraft/server";

// Este codigo fue creado por Convex, tw: https://twitter.com/convex__ ; discord: @convecs#6207 y esta bajo la licencia MIT, esta permitido su uso comercial o privado siempre que se incluyan los creditos del creador.
// Funciona para la creacion de una reliquia que libera slots del inventario bloqueados, debajo estan las especificaciones de cada variable, modifica a las necesidades de tu relquia, cualquier duda contacta con Convex.

const relic = "minecraft:apple";    //Identificador del item que funcionara como tu reliquia.
const lock = "minecraft:barrier";   //Identificador del item que funcionara como bloqueo de slot.
const lockedSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];    //Lista o Arreglo de slots que se perderan, no tienen que ser numeros seguidos, pueden ser 2, 5, 8, van del 0 hasta el 35 y siguen el orden del inventario.
const delay = 20;   //Retraso en ticks entre cada ejecucion del efecto de la reliquia, defalult 20 ticks = 1 segundo.
const lockedEquipment = { //En cada argumento true para bloquearlo al no tener la reliquia y false para no bloquearlo.
    "helmet": true, //true o false - Casco 
    "chestPlate": true, //true o false - Peto
    "leggings": true, //true o false - Perneras 
    "boots": true, //true o false - Botas 
    "offHand": true //true o false - Segunda mano 
}
const equipmentLock = [ //Lista de los items que bloquearan los slots de armadura y la segunda mano.
    "minecraft:barrier", //Pon aqui el item que bloqueara el casco.
    "minecraft:barrier", //Pon aqui el item que bloqueara el peto.
    "minecraft:barrier", //Pon aqui el item que bloqueara las perneras.
    "minecraft:barrier", //Pon aqui el item que bloqueara las botas.
    "minecraft:barrier" //Pon aqui el item que bloqueara la segunda mano.
]
//Debajo esta el codigo para que funcione la reliquia, no se recomenda que se modifique a menos que se sepa lo que se esta haciendo, se recomienda solo modificar los valores de arriba.

system.runInterval((loops) => {
    for (const player of world.getPlayers()) {
        let inventory = player.getComponent("inventory").container;
        let dim = player.dimension;
        let itemLock = new ItemStack(lock);
        const viewDirection = player.getViewDirection();
        itemLock.lockMode = 'slot';
        let pblock = dim.getBlock({ x: player.getHeadLocation().x, y: player.getHeadLocation().y, z: player.getHeadLocation().z });
        if (searchInventory(relic, player)) {
            player.runCommandAsync(`clear @s ${lock.replace(/"/g, '')}`);
            for (let j = 0; j < equipmentLock.length; j++) {
                player.runCommandAsync(`clear @s ${equipmentLock[j].replace(/"/g, '')}`);
            }
        } else {
            for (let i = 0; i < inventory.size; i++) {
                if (lockedSlots.includes(i)) {
                    let item = inventory.getItem(i);
                    if (item != undefined && item.typeId != lock) {
                        let newItem = dim.spawnItem(item, pblock);
                        newItem.applyImpulse({ x: viewDirection.x * 0.18, y: viewDirection.y * 0.18, z: viewDirection.z * 0.18 });
                        inventory.setItem(i, itemLock);
                    } else if (item == undefined) {
                        inventory.setItem(i, itemLock);
                    }
                }
            }
            if (!lockedEquipment.helmet && !lockedEquipment.chestPlate && !lockedEquipment.leggings && !lockedEquipment.boots && !lockedEquipment.offHand) return;
            if (lockedEquipment.helmet) {
                dropEquipment(player, dim, equipmentLock[0], "head", pblock, viewDirection);
            }
            if (lockedEquipment.chestPlate) {
                dropEquipment(player, dim, equipmentLock[1], "chest", pblock, viewDirection);
            }
            if (lockedEquipment.leggings) {
                dropEquipment(player, dim, equipmentLock[2], "legs", pblock, viewDirection);
            }
            if (lockedEquipment.boots) {
                dropEquipment(player, dim, equipmentLock[3], "feet", pblock, viewDirection);
            }
            if (lockedEquipment.offHand) {
                dropEquipment(player, dim, equipmentLock[4], "offhand", pblock, viewDirection);
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

function dropEquipment(player, dim, equipmentLock, slotName, pblock, viewDirection) {
    let equipment = player.getComponent('equipment_inventory');
    let lock = new ItemStack(equipmentLock);
    lock.lockMode = 'slot';
    if (equipment.getEquipment(slotName) != undefined && equipment.getEquipment(slotName).typeId != equipmentLock) {
        let slot = dim.spawnItem(equipment.getEquipment(slotName), pblock);
        slot.applyImpulse({ x: viewDirection.x * 0.18, y: viewDirection.y * 0.18, z: viewDirection.z * 0.18 });
        equipment.setEquipment(slotName, lock);
    } else if (equipment.getEquipment(slotName) == undefined) {
        equipment.setEquipment(slotName, lock);
    }
}
