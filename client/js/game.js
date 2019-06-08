var Game = {
    init: function() {
        this.paused = true

        this.tilesTab = []

        this.turnSkipCount = 0

        this.scoreboard = {
            myName: "",
            myScore: 0,
            opponentName: "",
            opponentScore: 0,
        }

        this.myTurn = null

        this.boardTab = [
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
        ]

        this.boardLetters = [
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"],
        ]

        this.lettersTab = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        this.letterBlocksTab = []

        this.trayTab = ["/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/"]

        this.wordTab = []

        this.selectedLetter = null

        this.isHorizontal = null

        this.firstMove = null

        this.exchange = false

        this.exchangeTab = []

        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor(0xeeeeee)
        this.renderer.setSize($(window).width(), $(window).height())
        this.renderer.shadowMap.enabled = true

        this.camera = new THREE.PerspectiveCamera(45, $(window).width() / $(window).height(), 1, 10000)
        this.camera.position.set(75, 150, 250)
        this.camera.lookAt(this.scene.position)
        this.camera.updateProjectionMatrix()

        window.addEventListener("resize", (e) => {
            Game.renderer.setSize($(window).width(), $(window).height());
            Game.camera.aspect = $(window).width() / $(window).height();
            Game.camera.updateProjectionMatrix();
        })

        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enabled = false

        this.clock = new THREE.Clock()

        this.grid = new Grid(1000, 100)
        this.scene.add(this.grid.getGrid())

        this.createScene()

        $("#root").append(this.renderer.domElement)
    },

    createScene: function() {
        this.entities = [] //wszystko co ma być updatowane co klatkę wchodzi do tej tablicy

        this.boardGen()
        this.letterBlockGen()
        this.trayCreate()
        this.createRayCaster()

        //tutaj dodawanie obiektów do sceny
        let centerTilePos = this.tilesTab[7][7].position.clone()
        centerTilePos.add(new THREE.Vector3(5, 0, 5))

        this.centerLight = new THREE.SpotLight(0xffffff, 0.56)
        this.centerLight.castShadow = true
        this.centerLight.position.set(centerTilePos.x, 100, centerTilePos.z)
        this.centerLight.target.position.set(centerTilePos.x, centerTilePos.y, centerTilePos.z)
        this.centerLight.target.updateMatrixWorld()
        this.scene.add(this.centerLight)

        this.frontLight = new THREE.SpotLight(0xffffff, 0.78)
        this.frontLight.castShadow = false
        this.frontLight.position.set(centerTilePos.x, 50, 300)
        this.frontLight.target.position.set(centerTilePos.x, centerTilePos.y, centerTilePos.z)
        this.frontLight.target.updateMatrixWorld()
        this.scene.add(this.frontLight)

        this.backLight = new THREE.SpotLight(0xffffff, 0.78)
        this.backLight.castShadow = false
        this.backLight.position.set(centerTilePos.x, 50, -300)
        this.backLight.target.position.set(centerTilePos.x, centerTilePos.y, centerTilePos.z)
        this.backLight.target.updateMatrixWorld()
        this.scene.add(this.backLight)
    },

    boardGen: function() {

        //generowanie całej planszy
        for (var tileCount_z = 0; tileCount_z < 15; tileCount_z++) {
            this.tilesTab[tileCount_z] = []
            for (var tileCount_x = 0; tileCount_x < 15; tileCount_x++) {

                if (tileCount_x == 7 && tileCount_z == 7) {
                    TileGen.color = "yellow"
                }
                var tile = new Tile(tileCount_x, tileCount_z)
                this.tilesTab[tileCount_z][tileCount_x] = tile
                this.scene.add(tile)
                if (TileGen.color == "lime") {
                    TileGen.color = "green"
                } else {
                    TileGen.color = "lime"
                }
            }


        }
        //console.log(this.scene)


    },

    letterBlockGen: function() {

        //generowanie wszystkich klocków (26 płytek z literkami) i dodanie ich do tablicy
        TileGen.type = "letter"
        TileGen.color = "white"
        for (var letterCount = 0; letterCount < this.lettersTab.length; letterCount++) {
            var letterTile = new Tile(null, null, this.lettersTab[letterCount], letterCount)
                ////console.log(letterTile)

            this.letterBlocksTab.push(letterTile)
                ////console.log(this.letterBlocksTab)
                //this.scene.add(letterTile)
        }
        for (var letterCount = 0; letterCount < this.letterBlocksTab.length; letterCount++) {
            var letter = new Letter(this.lettersTab[letterCount], letterCount)
                ////console.log(letter)
        }

    },

    trayCreate: function() {

        //stworzenie tacki (?) dla gracza składającej się z 15 części
        this.tr = new Tray()
        this.tray = this.tr.getTray()
        this.tray.position.set(0, 3, 160)
        this.tray.rotation.x = Math.PI / 4
        this.scene.add(this.tray)


    },

    giveLetter: function() {

        //wylosowanie płytki z literą z tablicy i wrzucenie jej graczowi na tackę
        //zautomatyzowane już, ponieważ zawsze musi być maks płytek na tacce, po kliknięciu Start Game to się uruchamia 15 razy.
        var randNum = Math.floor(Math.random() * 26)
            //console.log(this.letterBlocksTab[randNum])
        for (var trayCheck = 0; trayCheck < this.trayTab.length; trayCheck++) {
            if (this.trayTab[trayCheck] == "/") {
                var kloc = this.letterBlocksTab[randNum].clone()
                    //console.log(kloc)
                this.trayTab[trayCheck] = kloc
                    //console.log(this.trayTab)
                kloc.position.set(trayCheck * 10, 4.5, 161.5)
                kloc.rotation.x = Math.PI / 4
                this.scene.add(kloc)
                break
            }
        }

    },

    createRayCaster: function() {
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()
    },

    rayClick: function() {

        if (this.myTurn) {
            //obsługa raycastera w zależności od tego, co zostało kliknięte
            this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
            this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseVector, this.camera);

            this.intersects = this.raycaster.intersectObjects(this.scene.children, true);

            //console.log(this.intersects.length)
            //console.log(this.scene)

            if (this.intersects.length > 0) {
                var obj = this.intersects[0].object
                    //console.log(obj)
                if (obj.name.split("_")[0] == "letterBlock") {
                    if (!this.exchange) {
                        this.letterSelect()
                    } else {
                        this.exchangeMode()
                    }
                } else if (obj.name.split("_")[0] == "letter") {
                    this.intersects[0].object = this.intersects[0].object.parent
                    if (!this.exchange) {
                        this.letterSelect()
                    } else {
                        this.exchangeMode()
                    }
                } else if (obj.name.split("_")[0] == "tray") {
                    this.trayMove()
                } else if (obj.name.split("_")[0] == "tile") {
                    if (this.selectedLetter != null) {
                        this.letterPlaceCheck()
                    }

                }
            }
        } else {
            alert("Nie twoja tura śmieciu")
        }

    },

    letterSelect: function() {

        //wybór i podświetlenie klocka
        //klocki szare - leżące na planszy, ale nie zatwierdzone (możliwe do cofnięcia, lecz niemożliwe do pojedynczego przestawienia)
        //klocki białe - leżące na trayu
        //klocek czerwony - zaznaczony do przestawienia na trayu bądź wrzucenia na planszę
        var obj = this.intersects[0].object
        if (obj == this.selectedLetter) {

            //jeżeli kliknięty został zaznazony klocek to zostaje odznaczony
            if (this.wordTab.indexOf(this.selectedLetter) != "-1") {
                this.selectedLetter.color = "gray"
            } else {
                this.selectedLetter.color = "white"
            }
            this.selectedLetter.material = this.selectedLetter.color
            this.selectedLetter = null
        } else {
            if (this.trayTab.indexOf(obj) != "-1") {
                if (this.wordTab.indexOf(obj) == "-1") {
                    this.selectedLetter = obj
                    for (var trayLoop = 0; trayLoop < this.trayTab.length; trayLoop++) {
                        var trayObj = this.trayTab[trayLoop]
                        if (trayObj != "/") {
                            //jeżeli klocek jest na planszy, ale jest niezatwierdzony (znajduje się w tablicy this.wordTab), to zmienia się na szary, jeśli nie - na biały
                            if (this.wordTab.indexOf(trayObj) != "-1") {
                                trayObj.color = "gray"
                            } else {
                                trayObj.color = "white"
                            }
                            trayObj.material = trayObj.color
                        }
                    }
                    this.selectedLetter.color = "red"
                    this.selectedLetter.material = this.selectedLetter.color
                }
            }

        }
    },

    trayMove: function() {
        var obj = this.intersects[0].object
            //jeśli jakiś klocek jest zaznaczony i nie znajduje się na planszy, tylko na trayu, następuje zmiana miejsca w trayu i w tablicy
            //WAŻNE - jeśli klocek X został postawiony na planszy, a później klocek Y zostanie postawiony na trayu na poprzednim miejscu klocka X...
            //...to klocek X po zdjeciu z planszy wskoczy na poprzednie miejsce klocka Y
        if (this.selectedLetter != null) {
            if (this.wordTab.indexOf(this.selectedLetter) == "-1") {
                var clickedID = obj.name.split("_")[1]
                var swappedID = this.selectedLetter.position.x / 10
                var traySwap = this.trayTab[clickedID]
                this.trayTab[clickedID] = this.trayTab[swappedID]
                this.trayTab[swappedID] = traySwap
                this.selectedLetter.position.x = obj.position.x
                this.selectedLetter.color = "white"
                this.selectedLetter.material = this.selectedLetter.color
                this.selectedLetter = null
                    //console.log(this.trayTab)
            }
        }
    },

    letterPlaceCheck: function() {

        var obj = this.intersects[0].object
        var isNeighbor = false
        var underneath = false
            //jesli to dopiero pierwszy ruch (żółty klocek nie został jeszcze zasłoniony) - algorytm ten tu o zaraz pod tym
        for (var z = 0; z < this.boardTab.length; z++) {
            if (underneath) {
                break
            } else {
                for (var x = 0; x < this.boardTab[z].length; x++) {
                    if (this.boardTab[z][x] != "/") {
                        if (this.intersects[0].object.position.x == this.boardTab[z][x].position.x) {
                            if (this.intersects[0].object.position.z == this.boardTab[z][x].position.z) {
                                underneath = true
                                break
                            }
                        }
                    }
                }
            }
        }
        for (var count = 0; count < this.wordTab.length; count++) {
            if (underneath) {
                break
            } else {
                if (this.intersects[0].object.position.x == this.wordTab[count].position.x) {
                    if (this.intersects[0].object.position.z == this.wordTab[count].position.z) {
                        underneath = true
                    }
                }
            }
        }


        if (!underneath) {
            if (this.firstMove) {
                if (this.wordTab.length == 0) {
                    //jeśli nie ma żadnego klocka na planszy można postawić gdziekolwiek
                    this.letterPlace()
                } else if (this.wordTab.length == 1) {
                    //jeśli jest już jeden klocek następuje sprawdzenie czy jest stawiany w poziomie lub pionie
                    if (obj.position.x == this.wordTab[0].position.x) {
                        this.verticalCheck()

                    } else if (obj.position.z == this.wordTab[0].position.z) {
                        this.horizontalCheck()

                    }
                } else {
                    //jesli są więcej niz 2 klocki na planszy, kierunek jest narzucony: poziomy albo pionowy (sprawdzanie sąsiadów jak wyżej)
                    if (!this.isHorizontal) {
                        if (obj.position.x == this.wordTab[0].position.x) {
                            this.verticalCheck()
                        }
                    } else {
                        if (obj.position.z == this.wordTab[0].position.z) {
                            this.horizontalCheck()
                        }
                    }
                }
            } else {
                if (this.wordTab.length == 0) {
                    this.neighborCheck()
                } else {
                    //jesli są już klocki na planszy, kierunek jest narzucony
                    if (!this.isHorizontal) {
                        if (obj.position.x == this.wordTab[0].position.x) {
                            for (var wordCheck = 0; wordCheck < this.wordTab.length; wordCheck++) {
                                var neighbor = this.wordTab[wordCheck]
                                    //console.log(obj.position.z, neighbor.position.z)
                                if (obj.position.z == neighbor.position.z + 10 || obj.position.z == neighbor.position.z - 10) {
                                    isNeighbor = true
                                    break
                                }
                            }
                            if (isNeighbor) {
                                this.neighborCheck()
                            }
                        }
                    } else {
                        if (obj.position.z == this.wordTab[0].position.z) {
                            for (var wordCheck = 0; wordCheck < this.wordTab.length; wordCheck++) {
                                var neighbor = this.wordTab[wordCheck]
                                    //console.log(obj.position.x, neighbor.position.x)
                                if (obj.position.x == neighbor.position.x + 10 || obj.position.x == neighbor.position.x - 10) {
                                    isNeighbor = true
                                    break
                                }
                            }
                            if (isNeighbor) {
                                this.neighborCheck()
                            }
                        }
                    }
                }
            }
        }

    },

    verticalCheck: function() {
        var obj = this.intersects[0].object
        var isNeighbor = false
        for (var wordCheck = 0; wordCheck < this.wordTab.length; wordCheck++) {
            var neighbor = this.wordTab[wordCheck]
                //jesli stawiany w poziomie, sprawdzenie czy po lewej lub po prawej jest jakiś inny klocek (nie mozna zrobic dziur w slowach, ale mozna dokladac z dowolnej jego strony)
            if (obj.position.z == neighbor.position.z + 10 || obj.position.z == neighbor.position.z - 10) {
                isNeighbor = true
                break
            }
        }
        if (isNeighbor) {
            this.isHorizontal = false
            this.letterPlace()
        }
    },

    horizontalCheck: function() {
        var obj = this.intersects[0].object
        var isNeighbor = false
        for (var wordCheck = 0; wordCheck < this.wordTab.length; wordCheck++) {
            var neighbor = this.wordTab[wordCheck]
                //jesli stawiany w pionie, sprawdzenie czy nad nim lub pod nim jest inny klocek (nie mozna zrobic dziur w slowach, ale mozna dokladac z dowolnej jego strony)
            if (obj.position.x == neighbor.position.x + 10 || obj.position.x == neighbor.position.x - 10) {
                isNeighbor = true
                break
            }
        }
        if (isNeighbor) {
            this.isHorizontal = true
            this.letterPlace()
        }
    },

    neighborCheck: function() {
        var obj = this.intersects[0].object
        var axisZ = obj.name.split("_")[2]
        var axisX = obj.name.split("_")[1]
        var indexZ
        var indexX
        var side
        var neighbors = []
        var axis
            //console.log(this.boardTab)
            //sprawdzanie czy są sąsiedzi bo nie może być więcej niż jednego (dodatkowe ify na zapobiegniecie sprawdzaniu poza tablicą)
        if (axisZ != 0) {
            if (this.boardTab[axisZ - 1][axisX] != "/") {
                neighbors.push(this.boardTab[axisZ - 1][axisX])
                indexZ = axisZ - 1
                indexX = axisX
                side = "up"
                axis = "vertical"
            }
        }
        if (axisX != 0) {
            if (this.boardTab[axisZ][axisX - 1] != "/") {
                neighbors.push(this.boardTab[axisZ][axisX - 1])
                indexZ = axisZ
                indexX = axisX - 1
                side = "left"
                axis = "horizontal"
            }
        }
        if (axisZ != 14) {
            if (this.boardTab[+axisZ + +1][axisX] != "/") {
                neighbors.push(this.boardTab[+axisZ + +1][axisX])
                indexZ = +axisZ + +1
                indexX = axisX
                side = "down"
                axis = "vertical"
            }
        }
        if (axisX != 14) {
            if (this.boardTab[axisZ][+axisX + +1] != "/") {
                neighbors.push(this.boardTab[axisZ][+axisX + +1])
                indexZ = axisZ
                indexX = +axisX + +1
                side = "right"
                axis = "horizontal"
            }
        }
        //jesli slowo nie zostalo zaczete
        if (this.wordTab.length == 0) {
            //jesli jest tylko jeden sąsiad (tylko taka opcja jest dopuszczalna)
            if (neighbors.length == 1) {
                //sasiad i wszystkie nastepne literki w linii prostej musza zostac dopisane do tablicy liter tworzacych slowo
                if (axis == "horizontal") {
                    this.isHorizontal = true
                    while (this.boardTab[indexZ][indexX] != "/") {
                        if (side == "left") {
                            this.wordTab.push(this.boardTab[indexZ][indexX])
                            this.boardTab[indexZ][indexX].position.y = 4.5
                            indexX--
                        } else if (side == "right") {
                            this.wordTab.push(this.boardTab[indexZ][indexX])
                            this.boardTab[indexZ][indexX].position.y = 4.5
                            indexX++
                        }
                    }
                } else {
                    this.isHorizontal = false
                    while (this.boardTab[indexZ][indexX] != "/") {
                        if (side == "up") {
                            this.wordTab.push(this.boardTab[indexZ][indexX])
                            this.boardTab[indexZ][indexX].position.y = 4.5
                            indexZ--
                        } else if (side == "down") {
                            this.wordTab.push(this.boardTab[indexZ][indexX])
                            this.boardTab[indexZ][indexX].position.y = 4.5
                            indexZ++
                        }
                    }
                }
                this.letterPlace()
            }
        } else {
            //jesli slowo zostalo zaczete 
            if (neighbors.length == 1) {
                if (this.wordTab.indexOf(neighbors[0]) != "-1") {
                    this.letterPlace()
                }
            } else if (neighbors.length > 1) {

            } else {
                this.letterPlace()
            }
        }

    },

    letterPlace: function() {
        //jeśli wszystkie warunki postawienia klocka zostały spełnione, następuje jego postawienie

        var obj = this.intersects[0].object
            //console.log(obj)
        if (this.selectedLetter != null) {
            var tileX = obj.name.split("_")[1] * 10
            var tileZ = obj.name.split("_")[2] * 10
            this.selectedLetter.rotation.x = 0
            this.selectedLetter.position.x = tileX
            this.selectedLetter.position.z = tileZ
            this.selectedLetter.color = "gray"
            this.selectedLetter.material = this.selectedLetter.color
            this.wordTab.push(this.selectedLetter)

            this.boardLetters[tileZ / 10][tileX / 10] = this.selectedLetter.name.substr(12)

            //console.log(this.wordTab)
            this.selectedLetter = null

        }

        $("#placeWord").prop("disabled", false)
        $("#wordReset").prop("disabled", false)
        $("#exchangeMode").prop("disabled", true)
        $("#skip").prop("disabled", true)
    },

    resetWord: function() {
        //cofnięcie wszystkich klocków na tray na miejsca wdg tablicy
        var obj
        for (var countWord = 0; countWord < this.wordTab.length; countWord++) {
            for (var countTray = 0; countTray < this.trayTab.length; countTray++) {
                if (this.wordTab[countWord] == this.trayTab[countTray]) {
                    obj = this.wordTab[countWord]

                    this.boardLetters[obj.position.z / 10][obj.position.x / 10] = "/"

                    obj.position.x = countTray * 10
                    obj.position.z = 161.5
                    obj.rotation.x = Math.PI / 4
                    obj.color = "white"
                    obj.material = obj.color

                }
            }
        }
        for (var countBoardZ = 0; countBoardZ < this.boardTab.length; countBoardZ++) {
            for (var countBoardX = 0; countBoardX < this.boardTab[countBoardZ].length; countBoardX++) {

                obj = this.boardTab[countBoardZ][countBoardX]
                if (obj != "/") {
                    obj.position.y = 2
                }
            }
        }
        this.wordTab = []
        this.isHorizontal = null
        $("#placeWord").prop("disabled", true)
        $("#wordReset").prop("disabled", true)
        $("#exchangeMode").prop("disabled", false)
        $("#skip").prop("disabled", false)
    },

    centerTaken: function() {
        //sprawdzenie czy został zajęty środkowy klocek (tylko przy pierwszym słowie)
        return this.lettersTab.includes(this.boardLetters[7][7])
    },

    centerCheck: function() {
        if (this.centerTaken()) {
            this.acceptWord()
        } else {
            alert("You have to place any block on the yellow square")
        }
    },

    acceptWord: function() {
        //zanim litery zostaną zaakceptowane na planszy to pętla leci przez tablicę, aby zapisać utworzone słowo w odpowiedniej kolejności do zmiennej (potem pewnie przerobimy na tablice czy coś)
        var word = ""
        if (this.isHorizontal) {
            var zAxis
            for (var x = 0; x < 15; x++) {
                for (var z = 0; z < 15; z++) {
                    for (var count = 0; count < this.wordTab.length; count++) {
                        var obj = this.wordTab[count]
                        if (obj.position.x == x * 10 && obj.position.z == z * 10) {
                            zAxis = z * 10
                            break
                        }
                    }
                    if (zAxis != undefined) {
                        break
                    }
                }
                if (zAxis != undefined) {
                    break
                }
            }
            for (var x = 0; x < 15; x++) {
                for (var count = 0; count < this.wordTab.length; count++) {
                    var obj = this.wordTab[count]
                    if (obj.position.x == x * 10 && obj.position.z == zAxis) {
                        word += obj.name.split("_")[1]
                        break
                    }
                }
            }

            //console.log(word)
        } else {
            var xAxis
            for (var z = 0; z < 15; z++) {
                for (var x = 0; x < 15; x++) {
                    for (var count = 0; count < this.wordTab.length; count++) {
                        var obj = this.wordTab[count]
                        if (obj.position.x == x * 10 && obj.position.z == z * 10) {
                            xAxis = x * 10
                            break
                        }

                    }
                    if (xAxis != undefined) {
                        break
                    }
                }
                if (xAxis != undefined) {
                    break
                }
            }
            for (var z = 0; z < 15; z++) {
                for (var count = 0; count < this.wordTab.length; count++) {
                    var obj = this.wordTab[count]
                    if (obj.position.x == xAxis && obj.position.z == z * 10) {
                        word += obj.name.split("_")[1]
                        break
                    }
                }
            }
            //console.log(word)

        }

        SocketHander.emit("check-word", { word: word }, function(data) {
            alert(`Słowo '${data.word}' jest ${data.answer ? "poprawne" : "niepoprawne"}!`)

            if (data.answer) {
                SocketHander.emit("end-turn", null, function(data) {
                    if (!data.success) {
                        alert("ERROR: Not my turn")
                        return
                    }
                    //zaakceptowanie klocków na planszy
                    for (var countWord = 0; countWord < Game.wordTab.length; countWord++) {
                        var obj = Game.wordTab[countWord]
                        var tileX = obj.position.x / 10
                        var tileZ = obj.position.z / 10
                        obj.color = "yellow"
                        obj.material = obj.color
                        obj.position.y = 2
                        Game.boardTab[tileZ][tileX] = obj
                        for (var countTray = 0; countTray < Game.trayTab.length; countTray++) {
                            var trayObj = Game.trayTab[countTray]
                            if (trayObj == obj) {
                                Game.trayTab[countTray] = "/"
                            }
                        }
                    }
                    var length = Game.wordTab.length
                    Game.wordTab = []
                    Game.isHorizontal = null
                    Game.firstMove = false
                    Game.turnSkipCount = 0
                        //console.log(Game.boardTab)
                    $("#placeWord").prop("disabled", true)
                    $("#wordReset").prop("disabled", true)
                    $("#exchangeMode").prop("disabled", false)
                    $("#skip").prop("disabled", false)
                    Game.scoreboard.myScore += length

                    SocketHander.emit("send-score", { score: Game.scoreboard.myScore })
                    $("#scoreboard").html("<h3>" + Game.scoreboard.myName + " : " + Game.scoreboard.myScore + "</h3>" + "<h3>" + Game.scoreboard.opponentName + " : " + Game.scoreboard.opponentScore + "</h3>")

                    SocketHander.emit("send-board", { board: Game.boardLetters })
                    var draw = setInterval(function() {
                        if (length <= 0) {
                            clearInterval(draw)
                        } else {
                            Game.giveLetter()
                            length--
                        }

                    }, 100)
                })
            } else Game.resetWord()
        })
    },

    exchangeMode: function() {

        //obsługa trybu wymiany literek (kolorowanie/odkolorowanie płytek)
        var obj = this.intersects[0].object
        if (this.exchangeTab.indexOf(obj) == -1) {
            this.exchangeTab.push(obj)
            obj.color = "orange"
            obj.material = obj.color
        } else {
            var index = this.exchangeTab.indexOf(obj)
            this.exchangeTab.splice(index, 1)
            obj.color = "white"
            obj.material = obj.color
        }

    },

    exchangeLetters: function() {
        //wymiana literek i automatyczny dobór
        var del
        var length = this.exchangeTab.length
        for (var count = 0; count < this.exchangeTab.length; count++) {
            del = this.exchangeTab[count]
            this.scene.remove(del)
            if (this.trayTab.indexOf(del) != -1) {
                var index = this.trayTab.indexOf(del)
                this.trayTab[index] = "/"
            }
        }
        $("#exchangeMode").text("REDRAW LETTERS")
        $("#exchange").prop("disabled", true)
        this.exchange = false

        var redraw = setInterval(function() {
            if (length <= 0) {
                clearInterval(redraw)
            } else {
                Game.giveLetter()
                length--
            }

        }, 100)
        this.exchangeTab = []
        this.turnSkipCount = 0
    },

    updateBoardLetters() {
        for (let x in this.boardTab) {
            let row = this.boardTab[x]
            for (let y in row) {
                let obj = row[y]
                if (y != "/") {
                    this.scene.remove(obj)
                    this.boardTab[x][y] = "/"
                }
            }
        }

        for (let z in this.boardLetters) {
            let row = this.boardLetters[z]
            for (let x in row) {
                let letter = row[x]
                if (this.lettersTab.includes(letter)) {
                    let block = this.letterBlocksTab[this.lettersTab.indexOf(letter)].clone()
                    block.position.set(x * 10, 2, z * 10)
                    block.color = "yellow"
                    block.material = block.color
                    this.boardTab[z][x] = block
                    this.scene.add(block)
                }
            }
        }
    },

    updateBoard(tab) {
        this.boardLetters = tab
        this.updateBoardLetters()
    },

    start: function() {
        this.orbitControls.enabled = true
        this.resume()
    },

    update: function() {
        let delta = this.clock.getDelta()

        for (let entity of this.entities) entity.update(delta)

        this.render()
    },

    render: function() {
        this.renderer.render(this.scene, this.camera)
        if (!this.paused)
            requestAnimationFrame(this.update.bind(this))
    },

    pause: function() {
        this.paused = true
    },

    resume: function() {
        this.paused = false
        requestAnimationFrame(this.update.bind(this))
    }
}