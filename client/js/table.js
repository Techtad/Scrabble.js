class Table {
    constructor() {

        var mtlLoader = new THREE.MTLLoader()
        mtlLoader.setResourcePath("model/")
        mtlLoader.setPath("model/")

        Ui.setOverlay("LOADING...", 1)
        mtlLoader.load("wooden-coffe-table.mtl", function (materials) {
            materials.preload()

            var objLoader = new THREE.OBJLoader()
            objLoader.setMaterials(materials)
            objLoader.setPath("model/")
            objLoader.load("wooden-coffe-table.obj", function (obj) {
                obj.scale.set(110, 110, 110)
                obj.position.set(70, -144, 70)
                console.log(obj)
                Game.scene.add(obj)

                Ui.removeOverlay()
            })

        })
    }

}