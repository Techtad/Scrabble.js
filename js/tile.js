class Tile extends THREE.Mesh {
    constructor(posX, posZ, letter, count) {
        super(new THREE.BoxGeometry(10, 2, 10), new THREE.MeshBasicMaterial({ color: TileGen.color }))



        if (TileGen.type == "board") {
            this.position.x = 10 * posX
            this.position.z = 10 * posZ
            this.name = "tile_" + posX + "_" + posZ
        } else if (TileGen.type == "letter") {
            this.position.y = -500
            this.position.x = count * 20
            this.name = "letterBlock_" + letter
                //var letterObj = new Letter(letter, count)
                //Game.scene.add(letterObj)


        }

    }

    set color(val) {
        //console.log("setter")
        this._color = val
    }

    get color() {
        //console.log("getter")
        return new THREE.MeshBasicMaterial({
            color: this._color
        })
    }

}