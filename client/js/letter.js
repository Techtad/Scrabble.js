var thatLetter
class Letter {
    constructor(letter, count) {

        thatLetter = this

        var loader = new THREE.FontLoader();

        loader.load('font/Courier_Regular.json', function(font) {

            var letterGeo = new THREE.TextGeometry(letter, {
                font: font,
                size: 8,
                height: 1,
            });

            var letterMat = new THREE.MeshBasicMaterial({ color: "darkblue" })
            var letterMesh = new THREE.Mesh(letterGeo, letterMat)
            letterMesh.position.y = 0.5
            letterMesh.position.x = -3
            letterMesh.position.z = 3
            letterMesh.rotation.x = Math.PI / 2 * 3
                //letterMesh.position.x = count * 20
            letterMesh.name = "letter_" + letter
                /* console.log(thatTile)
                console.log(letterMesh) */

            Game.letterBlocksTab[count].add(letterMesh)
        });





    }



}