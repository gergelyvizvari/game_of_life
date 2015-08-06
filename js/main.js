var GameOfLife = function (_canvasId) {    
    this.context = null;
    this.width = 0;
    this.height = 0;
    this.map = [];
    this.timer = false;
    this.loopState = 1;
    
    this.init = function() {
        canvas = document.getElementById(_canvasId);
        this.context = canvas.getContext('2d');
        this.height = canvas.height;
        this.width = canvas.width;
        this.resetMap();
    };
    
    this.createMap = function() {
        this.map = [];
        for (x=0;x<this.width;x++) {
            this.map[x] = [];
            for (y=0;y<this.height;y++) {
                this.map[x][y] = 0;
            }
        }                
    };
    
    this.fillMapRandom =function() {
        for (i=0;i<this.width*this.height;i++) {
            xr = Math.floor(Math.random()*this.width);
            yr = Math.floor(Math.random()*this.height);
            this.map[xr][yr] = 1;
        }
    };
    
    this.resetMap = function () {
        this.timer = false;
        this.createMap();
        this.fillMapRandom();
        this.drawGame();
    };
    
    this.start = function() {
        this.timer = true;        
        this.loop();
    };
    
    this.stop = function() {
        this.timer = false;        
    };
    
    this.loop = function() {
        if (this.timer) {            
            if (this.loopState===4) this.loopState=1;
            switch (this.loopState) {
                case 1: this.checkDeads();break;
                case 2: this.checkBorns();break;
                case 3: this.setNewState();this.drawGame();break;
            }            
            this.loopState++;
            var me =this;
            setTimeout(function () {me.loop();/*me.drawGame();*/},0);
        }
    };
    
    this.nextStep = function() {
        if (this.loopState===4) this.loopState=1;
        switch (this.loopState) {
            case 1: this.checkDeads();break;
            case 2: this.checkBorns();break;
            case 3: this.setNewState();break;
        }            
        this.loopState++;
        this.drawGame();
    };
    
    this.getPositionState = function(x,y) {
        if (x<0 || x>=this.width) {
            return 0;
        }
        if (y<0 || y>=this.height) {
            return 0;
        }
        if (this.map[x][y]>0 && this.map[x][y]<3) {
            return 1;
        } else {
            return 0;
        }
    };
    
    this.countNeighbors = function(x,y) {
        
        var nb = 0;
        nb += this.getPositionState(x+1,y-1);
        nb += this.getPositionState(x,  y-1);
        nb += this.getPositionState(x-1,y-1);
        
        nb += this.getPositionState(x+1,  y);
        nb += this.getPositionState(x-1,  y);
        
        nb += this.getPositionState(x+1,y+1);
        nb += this.getPositionState(x,  y+1);
        nb += this.getPositionState(x-1,y+1);
        
        return nb;
    };
    
    this.checkDeads = function() {
        for (x=0;x<this.width;x++) {
            for (y=0;y<this.height;y++) {
                var nb = this.countNeighbors(x,y);
                if ((nb<2 || nb>3)&& this.map[x][y]===1) {
                    this.map[x][y] = 2;
                }
            }
        }
    };
    
    this.checkBorns = function() {
        for (x=0;x<this.width;x++) {
            for (y=0;y<this.height;y++) {
                var nb = this.countNeighbors(x,y);
                if ((nb===3) && this.map[x][y]===0) {
                    this.map[x][y] = 3;
                }
            }
        }
    };
    
    this.setNewState = function() {
        for (x=0;x<this.width;x++) {
            for (y=0;y<this.height;y++) {                
                if (this.map[x][y]=== 3) {
                    this.map[x][y] = 1;
                }
                if (this.map[x][y]=== 2) {
                    this.map[x][y] = 0;
                }
            }
        }
    }; 
    
    this.drawGame = function()
    {
        imageData = this.context.createImageData(this.width,this.height);
        data = imageData.data;
        
        id_pos=0;
        for (y=0;y<this.height;y++) {
            for (x=0;x<this.width;x++) {           
                
                if (this.map[x][y]===1) {
                    data[id_pos+0] = 0;
                    data[id_pos+1] = 0;
                    data[id_pos+2] = 0;
                    data[id_pos+3] = 255;
                }
                if (this.map[x][y]===2) {
                    data[id_pos+0] = 255;
                    data[id_pos+1] = 0;
                    data[id_pos+2] = 0;
                    data[id_pos+3] = 255;
                }
                if (this.map[x][y]===3) {
                    data[id_pos+0] = 0;
                    data[id_pos+1] = 255;
                    data[id_pos+2] = 0;
                    data[id_pos+3] = 255;
                }
                if (this.map[x][y]===0) {
                    data[id_pos+0] = 255;
                    data[id_pos+1] = 255;
                    data[id_pos+2] = 255;
                    data[id_pos+3] = 255;
                }
                id_pos+=4;
            }
        }   
        
        this.context.putImageData(imageData,0,0);
    };
    
    this.init();
};

var game = new GameOfLife('golCanvas');
