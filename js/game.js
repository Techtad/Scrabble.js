var Game = {
    init: function () {
        this.paused = true

        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor(0xeeeeee)
        this.renderer.setSize($(window).width(), $(window).height())

        this.camera = new THREE.PerspectiveCamera(45, $(window).width() / $(window).height(), 1, 10000)
        this.camera.position.set(0, 0, 0)
        this.camera.lookAt(this.scene.position)
        this.camera.updateProjectionMatrix()

        window.addEventListener("resize", (e) => { Game.renderer.setSize($(window).width(), $(window).height()); Game.camera.aspect = $(window).width() / $(window).height(); Game.camera.updateProjectionMatrix(); })

        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enabled = false

        this.clock = new THREE.Clock()

        this.socket = new io()

        this.createScene()

        $("#root").append(this.renderer.domElement)
    },

    createScene: function () {
        this.entities = [] //wszystko co ma być updatowane co klatkę wchodzi do tej tablicy

        //tutaj dodawanie obiektów do sceny
    },

    start: function () {
        this.orbitControls.enabled = true
        this.resume()
    },

    update: function () {
        let delta = this.clock.getDelta()

        for (let entity of this.entities) entity.update(delta)

        this.render()
    },

    render: function () {
        this.renderer.render(this.scene, this.camera)
        if (!this.paused)
            requestAnimationFrame(this.update.bind(this))
    },

    pause: function () {
        this.paused = true
    },

    resume: function () {
        this.paused = false
        requestAnimationFrame(this.update.bind(this))
    }
}