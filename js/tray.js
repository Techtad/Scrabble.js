class Tray {
    constructor() {

        this.container = new THREE.Object3D

        this.geometry = new THREE.BoxGeometry(10, 2, 10)
        this.material = new THREE.MeshBasicMaterial({ color: "black" })

        for (var trayCount = 0; trayCount < 15; trayCount++) {
            var trayPart = new THREE.Mesh(this.geometry, this.material)
            trayPart.position.x = trayCount * 10
            trayPart.name = "tray_" + trayCount
            this.container.add(trayPart)
        }
    }

    getTray() {
        return this.container
    }


}