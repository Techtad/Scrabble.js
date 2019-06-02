class Grid {

    constructor(parametrA, parametrB) {

        this.size = parametrA
        this.divisions = parametrB

        this.container = new THREE.Object3D();

        this.init()
    }

    init() {
        this.gridHelper = new THREE.GridHelper(this.size, this.divisions);
        this.container.add(this.gridHelper);
    }

    getGrid() {
        return this.gridHelper;
    }

}